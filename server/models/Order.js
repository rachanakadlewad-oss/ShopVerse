const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
        price: Number,
        title: String
      }
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "Order Placed",
    },
    shippingAddress: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)