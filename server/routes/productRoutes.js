const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController")

router.route("/")
  .post(protect, adminOnly, createProduct)
  .get(getProducts)

router.route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct)

module.exports = router