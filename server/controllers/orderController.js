const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { claimOwnerlessProducts } = require("./productController")

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

// Get Orders for Admin (strictly only orders of products owned by this admin)
exports.getAdminOrders = async (req, res) => {
  try {
    // Safely assign any ownerless products to this admin
    await claimOwnerlessProducts(req.user._id)

    // 1. Find all product IDs owned by this admin
    const myProducts = await Product.find({ createdBy: req.user._id }).select("_id")
    
    // If this admin does not own any products, return empty list
    if (!myProducts || myProducts.length === 0) {
      return res.json([])
    }

    const myProductIds = myProducts.map((p) => p._id.toString())
    const myProductIdSet = new Set(myProductIds)

    // 2. Find only orders that include at least one product owned by this admin
    const orders = await Order.find({
      "items.product": { $in: myProductIds }
    })
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 })

    // 3. Filter order items so admin only sees products owned by them,
    // and compute total for this admin's products
    const adminOrders = orders
      .map((order) => {
        const orderObj = order.toObject()

        const ownedItems = orderObj.items.filter((item) => {
          const prodId = item.product?._id
            ? item.product._id.toString()
            : item.product?.toString()
          return myProductIdSet.has(prodId)
        })

        const adminSubtotal = ownedItems.reduce(
          (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
          0
        )

        return {
          ...orderObj,
          items: ownedItems,
          adminTotalAmount: adminSubtotal
        }
      })
      .filter((order) => order.items.length > 0)

    res.json(adminOrders)
  } catch (error) {
    console.error("getAdminOrders error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}

// Update Order Status (Admin only - must own products in this order)
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

    // Safely claim any ownerless products first
    await claimOwnerlessProducts(req.user._id)

    // Verify this admin owns at least one product in this order
    const myProducts = await Product.find({ createdBy: req.user._id }).select("_id")
    const myProductIds = myProducts.map((p) => p._id.toString())

    const ownsProductInOrder = order.items.some((item) => {
      const prodId = item.product?.toString()
      return myProductIds.includes(prodId)
    })

    if (!ownsProductInOrder) {
      return res.status(403).json({ message: "Not authorized to update orders for products you do not own" })
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