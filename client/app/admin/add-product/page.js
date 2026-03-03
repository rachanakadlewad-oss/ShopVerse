"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "../../../lib/axios"

export default function AddProduct() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    stock: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await API.post("/products", {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    })

    alert("Product Added Successfully!")
    router.push("/products")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex items-center justify-center p-6">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-10 w-full max-w-lg shadow-2xl text-white">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="p-3 rounded bg-white/20 border border-white/30 focus:outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="p-3 rounded bg-white/20 border border-white/30 focus:outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-3 rounded bg-white/20 border border-white/30 focus:outline-none"
            required
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="p-3 rounded bg-white/20 border border-white/30 focus:outline-none"
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="p-3 rounded bg-white/20 border border-white/30 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-full font-semibold hover:scale-105 transition transform"
          >
            Create Product
          </button>

        </form>

      </div>
    </div>
  )
}