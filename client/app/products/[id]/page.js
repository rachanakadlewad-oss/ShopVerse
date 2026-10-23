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
  Truck,
  BadgeCheck,
  Minus,
  Plus,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import Loader, { ButtonSpinner, ProductCardSkeleton } from "../../../components/Loader"
import { useAuth } from "../../../context/AuthContext"
import ProductCard from "../../../components/ProductCard"

export default function ProductDetails() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setAdded(false)
    setQuantity(1)
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await API.get(`/products/${id}`)
        setProduct(data)
        // Fetch related (same category, different id)
        try {
          const { data: all } = await API.get("/products")
          setRelated(
            all
              .filter((p) => p._id !== id && (p.category === data.category || !data.category))
              .slice(0, 4)
          )
        } catch { /* ignore */ }
      } catch {
        toast.error("Product not found")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const addToCart = async () => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to add items to your cart.",
        action: { label: "Sign in", onClick: () => router.push("/login") },
      })
      return
    }
    setAdding(true)
    try {
      await API.post("/cart", { productId: product._id, quantity })
      setAdded(true)
      toast.success("Added to cart!", {
        description: `${product.title} ×${quantity}`,
        action: { label: "View cart", onClick: () => router.push("/cart") },
      })
      setTimeout(() => setAdded(false), 4000)
    } catch (err) {
      toast.error("Couldn't add to cart", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Loader label="Loading product…" />

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-5 bg-[#0a0a0f] text-[#9898b0]">
        <Package size={48} className="text-[#555568]" />
        <p className="text-lg font-medium">Product not found</p>
        <button
          onClick={() => router.back()}
          className="btn-ghost flex items-center gap-2 px-5 py-2.5 text-sm"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      </div>
    )
  }

  const inStock = product.stock > 0
  const maxQty = Math.min(product.stock || 10, 10)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 group flex items-center gap-2 text-sm text-[#9898b0] transition-all hover:text-white"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
          Back to products
        </button>

        {/* Main grid */}
        <div className="grid gap-10 md:grid-cols-2 slide-up">
          {/* ── Image ── */}
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 shadow-2xl">
            <img
              src={product.image}
              alt={product.title}
              className="w-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600"
              }}
            />
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <span className="rounded-full bg-rose-500 px-6 py-2 text-sm font-bold text-white">
                  Out of Stock
                </span>
              </div>
            )}
            {product.category && product.category !== "General" && (
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10">
                  <Tag size={11} />
                  {product.category}
                </span>
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-[#555568]"}
                  />
                ))}
              </div>
              <span className="text-sm text-[#9898b0]">4.0 · 128 reviews</span>
            </div>

            <p className="mt-5 leading-relaxed text-[#9898b0]">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <p className="flex items-center gap-0.5 text-4xl font-bold text-purple-300">
                <IndianRupee size={28} strokeWidth={2.5} />
                {Number(product.price).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Stock status */}
            <div className="mt-3">
              {inStock ? (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                  <BadgeCheck size={15} />
                  {product.stock <= 5
                    ? `Only ${product.stock} left in stock`
                    : "In stock & ready to ship"}
                </span>
              ) : (
                <span className="text-sm text-rose-400">Out of stock</span>
              )}
            </div>

            {/* Quantity selector */}
            {inStock && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-medium text-[#9898b0]">Quantity</span>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/4">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-l-xl text-[#9898b0] hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-[2.5rem] text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    disabled={quantity >= maxQty}
                    className="flex h-10 w-10 items-center justify-center rounded-r-xl text-[#9898b0] hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Subtotal */}
            {inStock && quantity > 1 && (
              <p className="mt-2 text-sm text-[#555568]">
                Subtotal:{" "}
                <span className="font-semibold text-purple-300">
                  ₹{(product.price * quantity).toLocaleString("en-IN")}
                </span>
              </p>
            )}

            {/* Add to cart */}
            <button
              type="button"
              onClick={addToCart}
              disabled={adding || !inStock}
              className={`mt-8 flex items-center justify-center gap-2 py-3.5 px-8 text-base font-semibold rounded-full transition-all ${
                added
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "btn-primary"
              }`}
            >
              {adding ? (
                <><ButtonSpinner />Adding to cart…</>
              ) : added ? (
                <><BadgeCheck size={18} />Added to Cart!</>
              ) : !inStock ? (
                "Out of Stock"
              ) : (
                <><ShoppingCart size={18} />Add to Cart</>
              )}
            </button>

            {/* Trust row */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Secure Payment", color: "text-emerald-400" },
                { icon: Truck, label: "Free Delivery", color: "text-purple-400" },
                { icon: Package, label: "Easy Returns", color: "text-pink-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 p-3 text-center"
                >
                  <Icon size={18} className={color} />
                  <span className="text-xs text-[#9898b0] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold">
              You might also like
            </h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} animDelay={i * 60} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
