const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
  placeOrder,
  getMyOrders,
  getOrderById
} = require("../controllers/orderController")

router.post("/", protect, placeOrder)
router.get("/my", protect, getMyOrders)
router.get("/:id", protect, getOrderById)

module.exports = router