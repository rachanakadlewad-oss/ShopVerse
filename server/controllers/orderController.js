const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const { shippingAddress } = req.body

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ message: "Incomplete shipping address. Please provide name, address, city, state, and pincode." })
    }

    // Filter out stale cart items whose product has been deleted from the database
    const validItems = cart.items.filter(item => item.product !== null && item.product !== undefined)
    const staleCount = cart.items.length - validItems.length

    if (staleCount > 0) {
      console.warn(`placeOrder: ${staleCount} stale/deleted product(s) found in cart for user ${req.user._id}. Removing them.`)
      // Clean up the stale items from cart
      cart.items = validItems
      await cart.save()
    }

    if (validItems.length === 0) {
      return res.status(400).json({
        message: "Your cart contains only unavailable products. Please add valid items before placing an order."
      })
    }

    const orderItems = validItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      title: item.product.title
    }))

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    })

    // Clear cart after successful order
    cart.items = []
    await cart.save()

    res.status(201).json(order)

  } catch (error) {
    console.error("placeOrder error:", error)
    res.status(500).json({
      message: error.message && process.env.NODE_ENV !== "production"
        ? `Server Error: ${error.message}`
        : "Server Error — please try again."
    })
  }
}

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Only allow the owner or admin to view order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get Orders for Admin (orders containing products created by this admin)
exports.getAdminOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ createdBy: req.user._id }).select("_id")
    const myProductIds = myProducts.map((p) => p._id)

    let orders
    if (myProductIds.length > 0) {
      orders = await Order.find({
        "items.product": { $in: myProductIds }
      })
        .populate("user", "name email")
        .populate("items.product")
        .sort({ createdAt: -1 })
    } else {
      // If this admin has not yet created products with createdBy, check if any products exist with createdBy
      const hasAnyCreatedBy = await Product.exists({ createdBy: { $exists: true, $ne: null } })
      if (!hasAnyCreatedBy) {
        orders = await Order.find()
          .populate("user", "name email")
          .populate("items.product")
          .sort({ createdAt: -1 })
      } else {
        orders = []
      }
    }

    res.json(orders)
  } catch (error) {
    console.error("getAdminOrders error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}

// Update Order Status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ message: "Status is required" })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status
    await order.save()

    const updated = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product")

    res.json({ message: "Order status updated successfully", order: updated })
  } catch (error) {
    console.error("updateOrderStatus error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}