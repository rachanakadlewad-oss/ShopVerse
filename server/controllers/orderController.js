const Order = require("../models/Order")
const Cart = require("../models/Cart")

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const { shippingAddress } = req.body

    const orderItems = cart.items.map(item => ({
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
      shippingAddress: shippingAddress || null
    })

    // Clear cart after order
    cart.items = []
    await cart.save()

    res.status(201).json(order)

  } catch (error) {
    console.error("placeOrder error:", error)
    res.status(500).json({ message: "Server Error" })
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

    // Only allow the owner to view their order
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}