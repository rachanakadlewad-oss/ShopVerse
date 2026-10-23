const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
  register,
  login,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)

// Saved addresses
router.get("/addresses", protect, getAddresses)
router.post("/addresses", protect, addAddress)
router.put("/addresses/:addressId", protect, updateAddress)
router.delete("/addresses/:addressId", protect, deleteAddress)

module.exports = router