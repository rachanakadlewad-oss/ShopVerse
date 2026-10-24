"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Boxes, ClipboardList, Plus, Shield, ArrowRight, ShoppingBag } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import Loader from "../../components/Loader"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login")
      } else if (user.role !== "admin") {
        router.replace("/products")
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.role !== "admin") {
    return <Loader label="Verifying admin access…" />
  }

  const cards = [
    {
      title: "My Products",
      desc: "View and manage all products created and sold by you. Monitor stock levels and remove listings.",
      href: "/admin/products",
      icon: Boxes,
      color: "text-purple-400",
      border: "hover:border-purple-500/40",
      bg: "bg-purple-500/10",
      badge: "Inventory Catalog",
    },
    {
      title: "Customer Orders",
      desc: "See who ordered your products, view buyer addresses, and update order statuses (Processing, Shipped, Delivered).",
      href: "/admin/orders",
      icon: ClipboardList,
      color: "text-pink-400",
      border: "hover:border-pink-500/40",
      bg: "bg-pink-500/10",
      badge: "Fulfillment & Status",
    },
    {
      title: "Add Product",
      desc: "Publish a new product with image, pricing, stock count, and category to the store.",
      href: "/admin/add-product",
      icon: Plus,
      color: "text-emerald-400",
      border: "hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      badge: "New Listing",
    },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-12 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300 mb-3">
            <Shield size={13} />
            Administrator Portal
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Welcome back, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="mt-2 text-sm text-[#9898b0] max-w-lg mx-auto">
            Manage your product inventory, track customer orders, and update order fulfillment.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-3 slide-up" style={{ animationDelay: "50ms" }}>
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <Link
                key={c.title}
                href={c.href}
                className={`group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm transition-all hover:bg-white/6 ${c.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg}`}>
                      <Icon size={24} className={c.color} />
                    </div>
                    <span className="rounded-full bg-white/4 border border-white/8 px-2.5 py-0.5 text-[11px] font-medium text-[#9898b0]">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#9898b0]">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                  Access {c.title}
                  <ArrowRight size={13} />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View Store link */}
        <div className="mt-10 text-center slide-up" style={{ animationDelay: "100ms" }}>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs text-[#9898b0] hover:text-white transition-colors"
          >
            <ShoppingBag size={14} />
            Switch to Customer Store View
          </Link>
        </div>
      </div>
    </div>
  )
}
