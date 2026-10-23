"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingBag,
  ArrowRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  Truck,
  Circle,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../lib/axios"
import Loader from "../../components/Loader"

const STATUS = {
  pending:    { icon: Clock,        color: "text-amber-400",  bg: "bg-amber-400/10 border-amber-400/20",   label: "Pending" },
  processing: { icon: Circle,       color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20",     label: "Processing" },
  shipped:    { icon: Truck,        color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", label: "Shipped" },
  delivered:  { icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-400/10 border-emerald-400/20", label: "Delivered" },
}

function getStatus(s) {
  return STATUS[s?.toLowerCase()] || STATUS.pending
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get("/orders/my")
      .then(({ data }) => setOrders(data))
      .catch((err) =>
        toast.error("Could not load orders", {
          description: err.response?.data?.message || "Please sign in and try again.",
        })
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading orders…" />

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center">
        <div className="scale-in flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-500/15 blur-2xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/8 bg-white/4">
              <Package className="h-10 w-10 text-pink-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">No orders yet</h1>
            <p className="mt-2 text-sm text-[#9898b0] max-w-xs">
              Your order history will appear here once you make a purchase.
            </p>
          </div>
          <Link href="/products" className="btn-primary flex items-center gap-2 px-7 py-3 text-sm">
            <ShoppingBag size={16} />
            Start Shopping
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 slide-up flex items-center gap-3">
          <Package className="h-7 w-7 text-pink-400" />
          <h1 className="text-2xl font-bold">My Orders</h1>
          <span className="rounded-full bg-pink-500/15 border border-pink-500/25 px-2.5 py-0.5 text-sm font-semibold text-pink-300">
            {orders.length}
          </span>
        </div>

        <div className="space-y-4">
          {orders.map((order, i) => {
            const { icon: StatusIcon, color, bg, label } = getStatus(order.status)
            const itemCount = order.items?.length ?? 0
            const productNames = order.items
              ?.slice(0, 2)
              .map((it) => it.title || it.product?.title || "Product")
              .join(", ")

            return (
              <div
                key={order._id}
                className="slide-up rounded-2xl border border-white/8 bg-white/3 p-5 transition-all hover:border-purple-500/20 hover:bg-white/5"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    {/* Order ID */}
                    <p className="font-mono text-xs text-[#555568]">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${bg} ${color}`}>
                      <StatusIcon size={11} />
                      {label}
                    </span>

                    {/* Products preview */}
                    <p className="text-sm text-[#9898b0] max-w-xs truncate">
                      {productNames}
                      {itemCount > 2 && ` +${itemCount - 2} more`}
                    </p>

                    {/* Date */}
                    {order.createdAt && (
                      <p className="flex items-center gap-1.5 text-xs text-[#555568]">
                        <Clock size={11} />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="flex items-center gap-0.5 text-xl font-bold text-purple-300">
                      <IndianRupee size={16} />
                      {Number(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-[#555568]">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-[#9898b0] hover:border-purple-500/40 hover:text-purple-300 transition-all"
                    >
                      <FileText size={12} />
                      View Invoice
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
