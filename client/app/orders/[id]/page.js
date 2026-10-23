"use client"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  IndianRupee,
  Package,
  Calendar,
  Hash,
  Zap,
  Clock,
  Truck,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import Loader from "../../../components/Loader"

const STATUS_STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"]
const STATUS_MAP = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
}

function OrderTracker({ status }) {
  const current = STATUS_MAP[status?.toLowerCase()] ?? 0
  return (
    <div className="flex items-center no-print">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            i <= current
              ? "bg-purple-500 text-white shadow shadow-purple-500/40"
              : "border border-white/15 bg-white/4 text-[#555568]"
          }`}>
            {i < current ? <CheckCircle2 size={13} /> : i + 1}
          </div>
          <div className={`ml-2 flex-shrink-0 text-xs font-medium hidden sm:block ${i <= current ? "text-white" : "text-[#555568]"}`}>
            {step}
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`mx-3 h-px flex-1 ${i < current ? "bg-purple-500" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OrderInvoicePage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => {
        toast.error("Could not load order", {
          description: err.response?.data?.message || "Please try again.",
        })
      })
      .finally(() => setLoading(false))
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <Loader label="Loading invoice…" />

  if (!order) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-5 bg-[#0a0a0f] text-[#9898b0]">
        <Package size={48} className="text-[#555568]" />
        <p className="text-lg font-medium">Order not found</p>
        <Link href="/orders" className="btn-ghost flex items-center gap-2 px-5 py-2.5 text-sm">
          <ArrowLeft size={14} />
          Back to Orders
        </Link>
      </div>
    )
  }

  const addr = order.shippingAddress
  const items = order.items ?? []
  const subtotal = order.totalAmount ?? 0
  const gst = Math.round(subtotal * 0.18)
  const grandTotal = subtotal + gst
  const invoiceNum = `INV-${order._id.slice(-8).toUpperCase()}`
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {/* Top bar (no-print) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-[#9898b0] hover:text-white transition-all"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-ghost flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Printer size={15} />
              Print
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Invoice Card ── */}
        <div
          className="slide-up rounded-3xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden"
          id="invoice-print"
        >
          {/* Invoice header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/8 px-8 py-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                    <Zap size={18} className="text-white" />
                  </div>
                  <span className="text-xl font-bold">ShopEase</span>
                </div>
                <p className="text-xs text-[#9898b0]">Premium Online Shopping</p>
                <p className="text-xs text-[#555568]">support@shopease.in</p>
              </div>

              {/* Invoice title */}
              <div className="text-right">
                <h1 className="text-3xl font-black tracking-tight gradient-text">INVOICE</h1>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center justify-end gap-2 text-[#9898b0]">
                    <Hash size={13} />
                    <span className="font-mono font-semibold text-white">{invoiceNum}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-[#9898b0]">
                    <Calendar size={13} />
                    <span>{orderDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Status tracker */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                Order Status
              </h3>
              <OrderTracker status={order.status} />
            </div>

            {/* Addresses */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Delivery address */}
              {addr ? (
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                    <MapPin size={13} className="text-purple-400" />
                    Delivery Address
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-white">{addr.name}</p>
                    <p className="text-[#9898b0]">{addr.line1}</p>
                    <p className="text-[#9898b0]">{addr.city}, {addr.state}</p>
                    <p className="text-[#9898b0]">Pincode: {addr.pincode}</p>
                    {addr.phone && (
                      <p className="flex items-center gap-1.5 text-[#9898b0] mt-2">
                        <Phone size={12} />
                        {addr.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                    Delivery Address
                  </h3>
                  <p className="text-sm text-[#555568]">No address provided</p>
                </div>
              )}

              {/* Order info */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                  <Package size={13} className="text-pink-400" />
                  Order Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9898b0]">Order ID</span>
                    <span className="font-mono text-xs text-white">{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9898b0]">Status</span>
                    <span className="font-semibold capitalize text-white">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9898b0]">Payment</span>
                    <span className="text-emerald-400 font-semibold">COD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9898b0]">Date</span>
                    <span className="text-white">{orderDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Items table ── */}
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                Items Ordered
              </h3>
              <div className="overflow-hidden rounded-2xl border border-white/8">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-2 border-b border-white/8 bg-white/4 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#555568]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Unit Price</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Table rows */}
                {items.map((item, i) => {
                  const title = item.title || item.product?.title || "Product"
                  const price = item.price ?? item.product?.price ?? 0
                  const rowTotal = price * item.quantity

                  return (
                    <div
                      key={i}
                      className={`grid grid-cols-12 gap-2 px-4 py-3.5 text-sm items-center ${
                        i < items.length - 1 ? "border-b border-white/8" : ""
                      }`}
                    >
                      <div className="col-span-6 flex items-center gap-3">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={title}
                            className="h-10 w-10 rounded-xl object-cover border border-white/8 flex-shrink-0"
                            onError={(e) => { e.target.style.display = "none" }}
                          />
                        )}
                        <span className="font-medium line-clamp-2 leading-snug">{title}</span>
                      </div>
                      <div className="col-span-2 text-center text-[#9898b0]">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right text-[#9898b0]">
                        ₹{Number(price).toLocaleString("en-IN")}
                      </div>
                      <div className="col-span-2 text-right font-semibold">
                        ₹{rowTotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Totals ── */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2.5 rounded-2xl border border-white/8 bg-white/3 p-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9898b0]">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9898b0] flex items-center gap-1">
                    <Tag size={10} /> GST (18%)
                  </span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9898b0] flex items-center gap-1">
                    <Truck size={10} /> Shipping
                  </span>
                  <span className="text-emerald-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between border-t border-white/8 pt-3 text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-purple-300">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/8 pt-6 text-center">
              <p className="text-sm font-semibold text-purple-300">Thank you for shopping with ShopEase!</p>
              <p className="mt-1 text-xs text-[#555568]">
                This is a computer-generated invoice and does not require a signature.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom actions (no-print) */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 no-print">
          <Link href="/orders" className="btn-ghost flex items-center gap-2 px-6 py-2.5 text-sm">
            All Orders
          </Link>
          <Link href="/products" className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
