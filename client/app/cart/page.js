"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IndianRupee,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../lib/axios"
import Loader, { ButtonSpinner, CartRowSkeleton } from "../../components/Loader"

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart")
      setCart(data)
    } catch (err) {
      toast.error("Could not load cart", {
        description: err.response?.data?.message || "Please sign in and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const removeItem = async (productId) => {
    setRemovingId(productId)
    try {
      const { data } = await API.delete(`/cart/${productId}`)
      setCart(data)
      toast.success("Item removed from cart")
    } catch {
      toast.error("Couldn't remove item")
    } finally {
      setRemovingId(null)
    }
  }

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return
    setUpdatingId(productId)
    try {
      const { data } = await API.patch(`/cart/${productId}`, { quantity: newQty })
      setCart(data)
    } catch {
      toast.error("Couldn't update quantity")
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <Loader label="Loading cart…" />

  const items = cart?.items ?? []
  const isEmpty = items.length === 0

  if (isEmpty) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center">
        <div className="scale-in flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/15 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/8 bg-white/4">
              <ShoppingBag className="h-10 w-10 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="mt-2 text-sm text-[#9898b0] max-w-xs">
              Looks like you haven't added anything yet. Start exploring!
            </p>
          </div>
          <Link href="/products" className="btn-primary flex items-center gap-2 px-7 py-3 text-sm">
            Browse Products
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
    0
  )
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 slide-up flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-purple-400" />
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <span className="rounded-full bg-purple-500/15 border border-purple-500/25 px-2.5 py-0.5 text-sm font-semibold text-purple-300">
            {items.length}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => {
              if (!item.product) return null
              const isRemoving = removingId === item.product._id
              const isUpdating = updatingId === item.product._id

              return (
                <div
                  key={item.product._id}
                  className={`slide-up flex gap-4 rounded-2xl border border-white/8 bg-white/3 p-4 transition-all ${
                    isRemoving ? "opacity-40 scale-95" : ""
                  }`}
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                  {/* Product image */}
                  <Link href={`/products/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-20 w-20 rounded-xl object-cover border border-white/8"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200"
                      }}
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link href={`/products/${item.product._id}`}>
                        <h2 className="truncate font-semibold text-sm hover:text-purple-300 transition-colors">
                          {item.product.title}
                        </h2>
                      </Link>
                      {item.product.category && item.product.category !== "General" && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#555568]">
                          <Tag size={10} />
                          {item.product.category}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      {/* Price */}
                      <div>
                        <p className="flex items-center gap-0.5 font-bold text-purple-300">
                          <IndianRupee size={13} />
                          {(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-[#555568]">
                            ₹{item.product.price.toLocaleString("en-IN")} each
                          </p>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-white/10 bg-white/4">
                          <button
                            type="button"
                            onClick={() => updateQty(item.product._id, item.quantity - 1)}
                            disabled={isUpdating || isRemoving || item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center text-[#9898b0] hover:text-white disabled:opacity-30 transition-colors"
                          >
                            {isUpdating ? <ButtonSpinner size={12} /> : <Minus size={12} />}
                          </button>
                          <span className="min-w-[1.75rem] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.product._id, item.quantity + 1)}
                            disabled={isUpdating || isRemoving}
                            className="flex h-7 w-7 items-center justify-center text-[#9898b0] hover:text-white disabled:opacity-30 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product._id)}
                          disabled={isRemoving || isUpdating}
                          className="flex items-center gap-1 rounded-lg border border-rose-400/20 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:border-rose-400/40 disabled:opacity-40 transition-all"
                        >
                          {isRemoving ? <ButtonSpinner size={12} /> : <Trash2 size={12} />}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Order Summary ── */}
          <div className="slide-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
              <h2 className="mb-5 text-base font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9898b0]">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9898b0] flex items-center gap-1">
                    <Tag size={11} /> GST (18%)
                  </span>
                  <span className="font-semibold">₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9898b0] flex items-center gap-1">
                    <Truck size={11} /> Shipping
                  </span>
                  <span className="font-semibold text-emerald-400">Free</span>
                </div>
              </div>

              <div className="my-4 border-t border-white/8" />

              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-purple-300">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="btn-primary mt-6 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-3 text-sm text-[#9898b0] hover:text-white hover:border-white/20 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
