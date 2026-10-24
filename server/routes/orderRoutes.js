const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus
} = require("../controllers/orderController")

router.post("/", protect, placeOrder)
router.get("/my", protect, getMyOrders)
router.get("/admin/all", protect, adminOnly, getAdminOrders)
router.put("/:id/status", protect, adminOnly, updateOrderStatus)
router.get("/:id", protect, getOrderById)

module.exports = router