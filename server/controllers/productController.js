const Product = require("../models/Product")
const User = require("../models/User")

// Helper: Safely assign ownerless or orphaned products to an active admin
const claimOwnerlessProducts = async (adminId) => {
  try {
    const existingAdmins = await User.find({ role: "admin" }).distinct("_id")
    await Product.updateMany(
      {
        $or: [
          { createdBy: { $exists: false } },
          { createdBy: null },
          { createdBy: { $nin: existingAdmins } }
        ]
      },
      { $set: { createdBy: adminId } }
    )
  } catch (error) {
    console.error("claimOwnerlessProducts error:", error)
  }
}

exports.claimOwnerlessProducts = claimOwnerlessProducts

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user?._id
    })
    res.status(201).json(product)
  } catch (error) {
    console.error("createProduct error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}

// Get Products created by logged-in Admin
exports.getMyProducts = async (req, res) => {
  try {
    // Safely assign any ownerless products to the logged-in admin
    await claimOwnerlessProducts(req.user._id)

    const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error("getMyProducts error:", error)
    res.status(500).json({ message: "Server Error" })
  }
}

// Get All Products (supports ?search= and ?category= query params)
exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query
    const filter = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    if (category && category !== "All") {
      filter.category = category
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
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

    // If product has createdBy, verify it's the owner or admin
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this product" })
    }

    await product.deleteOne()
    res.json({ message: "Product removed" })
  } catch (error) {
    res.status(500).json({ message: "Server Error" })
  }
}