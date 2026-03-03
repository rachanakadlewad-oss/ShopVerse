const Product = require("../models/Product")

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product)
      return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product)
      return res.status(404).json({ message: "Product not found" })

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product)
      return res.status(404).json({ message: "Product not found" })

    await product.deleteOne()
    res.json({ message: "Product removed" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}