const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")
const {
  createProduct,
  getMyProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController")

router.route("/")
  .post(protect, adminOnly, createProduct)
  .get(getProducts)

router.get("/admin/my", protect, adminOnly, getMyProducts)

router.route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct)

module.exports = router