const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cartController")

router.post("/", protect, addToCart)
router.get("/", protect, getCart)
router.patch("/:productId", protect, updateCartItem)
router.delete("/clear", protect, clearCart)
router.delete("/:productId", protect, removeFromCart)

module.exports = router