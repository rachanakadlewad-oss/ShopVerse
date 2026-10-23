"use client"
import { useState } from "react"
import Link from "next/link"
import { IndianRupee, ShoppingCart, Eye, Star, BadgeCheck } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import API from "../lib/axios"
import { useAuth } from "../context/AuthContext"
import { ButtonSpinner } from "./Loader"

export default function ProductCard({ product, animDelay = 0 }) {
  const { user } = useAuth()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const addToCart = async (e) => {
    e.preventDefault() // don't navigate on card click
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to add items to your cart.",
        action: { label: "Sign in", onClick: () => router.push("/login") },
      })
      return
    }

    setAdding(true)
    try {
      await API.post("/cart", { productId: product._id, quantity: 1 })
      setAdded(true)
      toast.success("Added to cart!", {
        description: product.title,
        action: { label: "View cart", onClick: () => router.push("/cart") },
      })
      setTimeout(() => setAdded(false), 3000)
    } catch (err) {
      toast.error("Couldn't add to cart", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-500/10 hover:shadow-xl slide-up"
      style={{ animationDelay: `${animDelay}ms`, animationFillMode: "both" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Link href={`/products/${product._id}`} tabIndex={-1} aria-hidden>
          <img
            src={product.image}
            alt={product.title}
            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"
            }}
          />
        </Link>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

        {/* Category badge */}
        {product.category && product.category !== "General" && (
          <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
            {product.category}
          </span>
        )}

        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-rose-500/90 px-4 py-1.5 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view on hover */}
        <Link
          href={`/products/${product._id}`}
          className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
            <Eye size={13} />
            Quick View
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product._id}`}>
          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors hover:text-purple-300">
            {product.title}
          </h2>
        </Link>

        {/* Rating (static for now) */}
        <div className="mt-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={11}
              className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-[#555568]"}
            />
          ))}
          <span className="ml-1 text-xs text-[#555568]">4.0</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="flex items-center gap-0.5 text-lg font-bold text-purple-300">
            <IndianRupee size={15} />
            {Number(product.price).toLocaleString("en-IN")}
          </p>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-amber-400 font-medium">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          onClick={addToCart}
          disabled={adding || product.stock === 0}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${
            added
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
              : "btn-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {adding ? (
            <>
              <ButtonSpinner size={14} />
              Adding…
            </>
          ) : added ? (
            <>
              <BadgeCheck size={15} />
              Added!
            </>
          ) : product.stock === 0 ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart size={15} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
