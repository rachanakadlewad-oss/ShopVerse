"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  IndianRupee,
  Package,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../lib/axios"
import Loader from "../../components/Loader"

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", label: "Pending" },
  processing: { icon: Package, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Shipped" },
  delivered: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", label: "Delivered" },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/my")
        setOrders(data)
      } catch (err) {
        toast.error("Could not load orders", {
          description: err.response?.data?.message || "Please sign in and try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return <Loader label="Loading orders…" />

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 text-white">
        <div className="scale-in flex flex-col items-center gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10">
              <Package className="h-10 w-10 text-pink-300" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold">No orders yet</p>
            <p className="mt-2 text-sm text-zinc-400 max-w-xs">
              Your purchases will appear here after checkout.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
          >
            <ShoppingBag size={16} />
            Start shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 slide-up flex items-center gap-3">
          <Package className="h-7 w-7 text-pink-400" />
          <h1 className="text-3xl font-bold">My Orders</h1>
          <span className="ml-2 rounded-full bg-pink-500/20 px-2.5 py-0.5 text-sm text-pink-300 border border-pink-500/30">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {orders.map((order, i) => {
            const status = order.status?.toLowerCase() || "pending"
            const config = statusConfig[status] || statusConfig.pending
            const StatusIcon = config.icon

            return (
              <div
                key={order._id}
                className="slide-up rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    {/* Order ID */}
                    <p className="text-xs font-mono text-zinc-500">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </p>

                    {/* Status badge */}
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bg} ${config.color}`}
                    >
                      <StatusIcon size={12} />
                      {config.label}
                    </span>

                    {/* Items list */}
                    {order.items && order.items.length > 0 && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 mb-1">Total</p>
                    <p className="flex items-center justify-end gap-0.5 text-xl font-bold text-purple-300">
                      <IndianRupee size={17} />
                      {Number(order.totalAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order date if available */}
                {order.createdAt && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600 border-t border-white/5 pt-3">
                    <Clock size={11} />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
