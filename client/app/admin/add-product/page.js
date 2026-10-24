"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Image as ImageIcon,
  IndianRupee,
  Package,
  Plus,
  FileText,
  Tag,
  ArrowLeft,
  Boxes
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import API from "../../../lib/axios"
import Loader, { ButtonSpinner } from "../../../components/Loader"
import { useAuth } from "../../../context/AuthContext"

const CATEGORIES = [
  "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Books", "Sports", "General"
]

export default function AddProduct() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Sign in required", { description: "Please sign in to access admin tools." })
        router.replace("/login")
      } else if (user.role !== "admin") {
        toast.error("Unauthorized", { description: "Admin access required." })
        router.replace("/products")
      }
    }
  }, [user, loading, router])

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    category: "General",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === "image") setImagePreview(value)
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

      toast.success("Product added!", { description: `"${form.title}" has been added to your products.` })
      router.push("/admin/products")
    } catch (err) {
      toast.error("Could not add product", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user || user.role !== "admin") {
    return <Loader label="Verifying admin access…" />
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-10 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 slide-up">
          <Link
            href="/admin/products"
            className="group mb-4 inline-flex items-center gap-2 text-sm text-[#9898b0] hover:text-white transition-colors"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
            Back to My Products
          </Link>
          <h1 className="text-3xl font-bold">
            Add New <span className="gradient-text">Product</span>
          </h1>
          <p className="mt-1 text-sm text-[#9898b0]">Fill in the details to add a product to the catalog</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="slide-up lg:col-span-3" style={{ animationDelay: "50ms" }}>
            <div className="rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                    Product Title <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Sony WH-1000XM5 Headphones"
                      value={form.title}
                      onChange={handleChange}
                      className="input-base pl-10 py-3 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                    Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the product features, specifications…"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-base resize-none py-3 text-sm"
                    required
                  />
                </div>

                {/* Price + Stock */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                      Price (₹) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="input-base pl-10 py-3 text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                      Stock <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Package size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="0"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        className="input-base pl-10 py-3 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="input-base pl-10 py-3 text-sm appearance-none bg-[#111118]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                    Image URL <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                    <input
                      type="url"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={form.image}
                      onChange={handleChange}
                      className="input-base pl-10 py-3 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
                >
                  {submitting ? (
                    <><ButtonSpinner />Creating product…</>
                  ) : (
                    <><Plus size={17} />Create Product</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Preview panel */}
          <div className="slide-up lg:col-span-2" style={{ animationDelay: "100ms" }}>
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
              <div className="border-b border-white/8 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Preview</p>
              </div>

              {/* Image preview */}
              <div className="aspect-square overflow-hidden bg-white/4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-[#555568]">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-xs">Image preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                {form.category && form.category !== "General" && (
                  <span className="text-xs font-medium text-purple-400">{form.category}</span>
                )}
                <p className="font-semibold text-sm leading-snug text-white">
                  {form.title || "Product title"}
                </p>
                {form.price && (
                  <p className="flex items-center gap-0.5 text-purple-300 font-bold">
                    <IndianRupee size={13} />
                    {Number(form.price).toLocaleString("en-IN")}
                  </p>
                )}
                {form.stock && (
                  <p className="text-xs text-[#9898b0]">
                    {Number(form.stock)} units in stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
