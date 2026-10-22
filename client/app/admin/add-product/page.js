"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Image as ImageIcon, IndianRupee, Package, Plus } from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import { ButtonSpinner } from "../../../components/Loader"

export default function AddProduct() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    stock: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await API.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })

      toast.success("Product added", { description: `${form.title} is now in the catalog.` })
      router.push("/products")
    } catch (err) {
      toast.error("Could not add product", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">Add New Product</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="rounded-xl border border-white/30 bg-white/20 p-3 outline-none focus:border-purple-400"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="rounded-xl border border-white/30 bg-white/20 p-3 outline-none focus:border-purple-400"
            required
          />

          <div className="relative">
            <IndianRupee size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-300" />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-white/20 p-3 pl-10 outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="relative">
            <ImageIcon size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-300" />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-white/20 p-3 pl-10 outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="relative">
            <Package size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-300" />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/30 bg-white/20 p-3 pl-10 outline-none focus:border-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <ButtonSpinner />
                Creating…
              </>
            ) : (
              <>
                <Plus size={18} />
                Create Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
