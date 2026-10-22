"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  IndianRupee,
  ShoppingBag,
  Trash2,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../lib/axios"
import Loader, { ButtonSpinner } from "../../components/Loader"

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
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

    fetchCart()
  }, [])

  const checkout = async () => {
    setCheckingOut(true)
    try {
      await API.post("/orders")
      const { data } = await API.get("/cart")
      setCart(data)
      toast.success("🎉 Order placed successfully!", {
        description: "Your order is confirmed and on its way.",
        duration: 6000,
      })
    } catch (err) {
      toast.error("Checkout failed", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setCheckingOut(false)
    }
  }

  const removeItem = async (id) => {
    setRemovingId(id)
    try {
      await API.delete(`/cart/${id}`)
      const { data } = await API.get("/cart")
      setCart(data)
      toast.success("Item removed", { description: "Item removed from your cart." })
    } catch (err) {
      toast.error("Could not remove item", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) return <Loader label="Loading cart…" />

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 text-white">
        <div className="scale-in flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <ShoppingBag className="h-10 w-10 text-purple-300" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">Your cart is empty</p>
            <p className="mt-2 text-sm text-zinc-400 max-w-xs">
              Add something you love and it will show up here.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
          >
            Browse products
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 slide-up flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <span className="ml-2 rounded-full bg-purple-500/20 px-2.5 py-0.5 text-sm text-purple-300 border border-purple-500/30">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {cart.items.map((item, i) => (
            <div
              key={item.product._id}
              className="slide-up flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              {/* Product image thumbnail */}
              {item.product.image && (
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="h-14 w-14 rounded-xl object-cover border border-white/10 flex-shrink-0"
                />
              )}

              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-white">{item.product.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-zinc-400">
                  <IndianRupee size={13} />
                  <span>{item.product.price}</span>
                  <span className="mx-1 text-zinc-600">×</span>
                  <span className="font-medium text-zinc-300">{item.quantity}</span>
                </p>
              </div>

              {/* Item subtotal */}
              <p className="flex items-center gap-0.5 font-semibold text-purple-300 flex-shrink-0">
                <IndianRupee size={15} />
                {(item.product.price * item.quantity).toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.product._id)}
                disabled={removingId === item.product._id || checkingOut}
                className="flex items-center gap-1.5 rounded-full border border-rose-400/30 px-3 py-2 text-sm text-rose-300 transition-all hover:bg-rose-500/10 hover:border-rose-400/60 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
                aria-label={`Remove ${item.product.title} from cart`}
              >
                {removingId === item.product._id ? (
                  <ButtonSpinner className="h-3.5 w-3.5" />
                ) : (
                  <Trash2 size={14} />
                )}
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm slide-up" style={{ animationDelay: `${cart.items.length * 60}ms`, animationFillMode: "both" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-zinc-400">Subtotal</span>
            <span className="flex items-center font-semibold text-white">
              <IndianRupee size={15} />
              {total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-zinc-400">Delivery</span>
            <span className="text-sm font-medium text-emerald-400">Free</span>
          </div>
          <div className="my-4 border-t border-white/10" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-zinc-500">Total</p>
              <h2 className="flex items-center text-2xl font-bold text-white">
                <IndianRupee size={20} />
                {total.toLocaleString()}
              </h2>
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={checkingOut || Boolean(removingId)}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.03] hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {checkingOut ? (
                <>
                  <ButtonSpinner />
                  Placing order…
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
