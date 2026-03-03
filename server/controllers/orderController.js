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

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }))

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount
    })

    // Clear cart after order
    cart.items = []
    await cart.save()

    res.status(201).json(order)

  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}