"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Search,
  FileText,
  Boxes,
  Plus,
  RefreshCw,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import Loader, { ButtonSpinner } from "../../../components/Loader"
import { useAuth } from "../../../context/AuthContext"

const ORDER_STATUSES = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
]

const STATUS_CONFIG = {
  "order placed": {
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/25",
    icon: Clock,
  },
  processing: {
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/25",
    icon: RefreshCw,
  },
  shipped: {
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/25",
    icon: Truck,
  },
  delivered: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/25",
    icon: CheckCircle2,
  },
  cancelled: {
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/25",
    icon: XCircle,
  },
}

function getStatusBadge(status) {
  const key = (status || "").toLowerCase()
  return (
    STATUS_CONFIG[key] || {
      color: "text-purple-400",
      bg: "bg-purple-400/10 border-purple-400/25",
      icon: Clock,
    }
  )
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Sign in required", { description: "Please sign in to access order management." })
        router.replace("/login")
      } else if (user.role !== "admin") {
        toast.error("Unauthorized", { description: "Admin access required." })
        router.replace("/products")
      } else {
        fetchAdminOrders()
      }
    }
  }, [user, authLoading, router])

  const fetchAdminOrders = async () => {
    try {
      setLoading(true)
      const { data } = await API.get("/orders/admin/all")
      setOrders(data)
    } catch (err) {
      toast.error("Could not load customer orders", {
        description: err.response?.data?.message || "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const { data } = await API.put(`/orders/${orderId}/status`, { status: newStatus })

      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      )

      toast.success("Order status updated", {
        description: `Order #${orderId.slice(-8).toUpperCase()} is now ${newStatus}.`,
      })
    } catch (err) {
      toast.error("Failed to update status", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (authLoading || (user && user.role !== "admin")) {
    return <Loader label="Verifying admin access…" />
  }

  const filteredOrders = orders.filter((order) => {
    const buyerName = order.user?.name || order.shippingAddress?.name || ""
    const buyerEmail = order.user?.email || ""
    const orderId = order._id || ""
    const q = search.toLowerCase()

    const matchesSearch =
      buyerName.toLowerCase().includes(q) ||
      buyerEmail.toLowerCase().includes(q) ||
      orderId.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === "All" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const totalRevenue = orders.reduce((acc, ord) => acc + (Number(ord.totalAmount) || 0), 0)
  const deliveredCount = orders.filter((o) => o.status?.toLowerCase() === "delivered").length
  const pendingCount = orders.filter((o) =>
    ["order placed", "processing"].includes(o.status?.toLowerCase())
  ).length

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-pink-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between slide-up">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/15 border border-pink-500/25 text-pink-400">
                <ClipboardList size={20} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-pink-400">
                Order Fulfillment
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Customer <span className="gradient-text">Orders</span>
            </h1>
            <p className="mt-1 text-sm text-[#9898b0]">
              See who ordered your products and update their fulfillment status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-[#9898b0] hover:text-white hover:border-purple-500/40 hover:bg-white/8 transition-all"
            >
              <Boxes size={16} className="text-purple-400" />
              My Products
            </Link>
            <Link
              href="/admin/add-product"
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 slide-up" style={{ animationDelay: "50ms" }}>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Total Orders</span>
              <Package size={18} className="text-pink-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{orders.length}</p>
            <p className="mt-1 text-xs text-[#9898b0]">Placed by customers</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Total Value</span>
              <IndianRupee size={18} className="text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-purple-300">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-[#9898b0]">Gross product sales</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Awaiting Delivery</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-400">{pendingCount}</p>
            <p className="mt-1 text-xs text-[#9898b0]">{deliveredCount} fulfilled successfully</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 space-y-4 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-11 py-2.5 text-sm"
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchAdminOrders}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-[#9898b0] hover:text-white hover:bg-white/8 transition-all"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/8 pb-3">
            {["All", ...ORDER_STATUSES].map((st) => {
              const active = statusFilter === st
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20"
                      : "text-[#9898b0] hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {st}
                </button>
              )
            })}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <Loader label="Loading customer orders…" />
        ) : filteredOrders.length === 0 ? (
          <div className="slide-up rounded-3xl border border-white/8 bg-white/3 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
              <ClipboardList size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">
              {search || statusFilter !== "All"
                ? "No matching orders found"
                : "No customer orders yet"}
            </h2>
            <p className="mt-2 text-sm text-[#9898b0] max-w-md mx-auto">
              {search || statusFilter !== "All"
                ? "Try adjusting your search terms or filter to see more orders."
                : "When customers purchase your listed products, their orders and shipping details will show up right here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, i) => {
              const badge = getStatusBadge(order.status)
              const StatusIcon = badge.icon
              const isUpdating = updatingId === order._id
              const customerName = order.user?.name || order.shippingAddress?.name || "Customer"
              const customerEmail = order.user?.email || "No email"
              const addr = order.shippingAddress

              return (
                <div
                  key={order._id}
                  className="slide-up rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm transition-all hover:border-purple-500/25"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Top Bar: Order ID, Date, Status Selector */}
                  <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                          ORDER #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${badge.bg} ${badge.color}`}>
                          <StatusIcon size={12} />
                          {order.status || "Order Placed"}
                        </span>
                      </div>
                      <p className="mt-1.5 flex items-center gap-2 text-xs text-[#555568]">
                        <Calendar size={12} />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-3">
                      <label htmlFor={`status-${order._id}`} className="text-xs font-semibold text-[#9898b0] whitespace-nowrap">
                        Change Status:
                      </label>
                      <div className="relative">
                        <select
                          id={`status-${order._id}`}
                          value={order.status || "Order Placed"}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="input-base pl-3 pr-8 py-2 text-xs font-semibold bg-[#111118] border-purple-500/30 hover:border-purple-400 text-white cursor-pointer disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {isUpdating && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ButtonSpinner />
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/orders/${order._id}`}
                        className="rounded-xl border border-white/10 bg-white/4 p-2 text-[#9898b0] hover:text-white hover:bg-white/8 transition-all"
                        title="View Full Invoice"
                      >
                        <FileText size={15} />
                      </Link>
                    </div>
                  </div>

                  {/* Middle: Customer Details & Shipping */}
                  <div className="grid gap-4 py-5 sm:grid-cols-2">
                    {/* Buyer Info */}
                    <div className="rounded-2xl border border-white/8 bg-white/2 p-4">
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-3">
                        <User size={13} className="text-purple-400" />
                        Buyer Information
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <p className="font-semibold text-white">{customerName}</p>
                        <p className="flex items-center gap-2 text-xs text-[#9898b0]">
                          <Mail size={12} className="text-[#555568]" />
                          {customerEmail}
                        </p>
                        {addr?.phone && (
                          <p className="flex items-center gap-2 text-xs text-[#9898b0]">
                            <Phone size={12} className="text-[#555568]" />
                            {addr.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-2xl border border-white/8 bg-white/2 p-4">
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-3">
                        <MapPin size={13} className="text-pink-400" />
                        Shipping Destination
                      </h4>
                      {addr ? (
                        <div className="space-y-1 text-xs text-[#9898b0]">
                          <p className="font-medium text-white">{addr.name}</p>
                          <p>{addr.line1}</p>
                          <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#555568]">No shipping address provided.</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Items Ordered */}
                  <div className="border-t border-white/8 pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-[#555568] mb-3">
                      Ordered Products ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-2.5">
                      {order.items?.map((item, idx) => {
                        const title = item.title || item.product?.title || "Product"
                        const image = item.product?.image
                        const price = item.price ?? item.product?.price ?? 0
                        const sub = price * item.quantity

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/2 p-3 text-sm"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {image ? (
                                <img
                                  src={image}
                                  alt={title}
                                  className="h-10 w-10 rounded-lg object-cover border border-white/8 flex-shrink-0"
                                  onError={(e) => { e.target.style.display = "none" }}
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/4 text-[#555568] flex-shrink-0">
                                  <Package size={16} />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-white line-clamp-1">{title}</p>
                                <p className="text-xs text-[#9898b0]">
                                  Qty: {item.quantity} × ₹{Number(price).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-white whitespace-nowrap">
                              ₹{sub.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                      <span className="text-xs text-[#9898b0]">Payment Method: COD</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9898b0]">Order Total:</span>
                        <span className="flex items-center font-bold text-base text-purple-300">
                          <IndianRupee size={14} />
                          {Number(order.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
