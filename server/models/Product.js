const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    category: {
      type: String,
      default: "General"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema)