const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" },
  name: String,
  phone: String,
  line1: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false }
}, { _id: true })

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user"
    },
    addresses: [addressSchema]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)