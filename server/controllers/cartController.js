const Cart = require("../models/Cart")

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user._id

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      })
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      )

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity
      } else {
        cart.items.push({ product: productId, quantity })
      }

      await cart.save()
    }

    const populated = await cart.populate("items.product")
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Update Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const { productId } = req.params

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" })
    }

    cart.items[itemIndex].quantity = quantity
    await cart.save()
    const populated = await cart.populate("items.product")
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Remove Item
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    )

    await cart.save()
    const populated = await cart.populate("items.product")
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (cart) {
      cart.items = []
      await cart.save()
    }
    res.json({ message: "Cart cleared" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}