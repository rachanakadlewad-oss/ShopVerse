"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  IndianRupee,
  ShoppingCart,
  ArrowLeft,
  Star,
  Package,
  Shield,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import Loader, { ButtonSpinner } from "../../../components/Loader"
import { useAuth } from "../../../context/AuthContext"

export default function ProductDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`)
        setProduct(data)
      } catch {
        toast.error("Could not load this product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const addToCart = async () => {
    if (!user) {
      toast.error("Please sign in", { description: "You need an account to add items to your cart." })
      router.push("/login")
      return
    }

    setAdding(true)
    try {
      await API.post("/cart", {
        productId: product._id,
        quantity,
      })
      toast.success("Added to cart! 🛒", {
        description: `${product.title} has been added to your cart.`,
        action: {
          label: "View cart",
          onClick: () => router.push("/cart"),
        },
      })
    } catch (err) {
      toast.error("Could not add to cart", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Loader label="Loading product…" />

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center gap-4 bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-zinc-400">
        <Package size={48} className="text-zinc-600" />
        <p className="text-lg">Product not found</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:text-white transition-all hover:border-white/30"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 transition-all hover:text-white group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        <div className="grid gap-10 md:grid-cols-2 slide-up">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

            {/* Rating placeholder */}
            <div className="mt-3 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-600"}
                />
              ))}
              <span className="ml-1 text-xs text-zinc-500">(4.0)</span>
            </div>

            <p className="mt-4 leading-relaxed text-zinc-400">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-end gap-2">
              <p className="flex items-center text-4xl font-bold text-purple-300">
                <IndianRupee size={28} />
                {Number(product.price).toLocaleString()}
              </p>
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <p className="mt-2 text-xs text-zinc-500">
                {product.stock > 0 ? (
                  <span className="text-emerald-400">
                    ✓ In stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-rose-400">Out of stock</span>
                )}
              </p>
            )}

            {/* Quantity selector */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm text-zinc-400">Qty:</span>
              <div className="flex items-center rounded-full border border-white/15 bg-white/5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white transition-colors"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              type="button"
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {adding ? (
                <>
                  <ButtonSpinner />
                  Adding to cart…
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                Secure checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Package size={13} className="text-purple-400" />
                Free delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
