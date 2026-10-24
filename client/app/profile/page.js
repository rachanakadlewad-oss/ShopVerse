"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  LogOut, Mail, Package, ShoppingBag, User, Shield,
  MapPin, Plus, Settings, Boxes, ClipboardList
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import Loader from "../../components/Loader"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  const handleLogout = () => {
    logout()
    toast.success("Signed out", { description: "Come back soon!" })
    router.push("/")
  }

  if (loading || !user) {
    return <Loader label="Loading profile…" />
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const quickLinks = [
    { href: "/products", icon: ShoppingBag, label: "Browse Products", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
    { href: "/orders", icon: Package, label: "My Orders", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
    { href: "/cart", icon: ShoppingBag, label: "My Cart", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  ]

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-10 sm:px-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-pink-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg">
        {/* Profile card */}
        <div className="slide-up rounded-3xl border border-white/10 bg-white/3 p-8 shadow-2xl backdrop-blur-sm">
          {/* Avatar + info */}
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold shadow-xl shadow-purple-500/25">
                {initials}
              </div>
              {user.role === "admin" && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 shadow-lg">
                  <Shield size={12} className="text-amber-900" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold truncate">{user.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#9898b0] truncate">
                <Mail size={13} />
                {user.email}
              </p>
              {user.role === "admin" ? (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400">
                  <Shield size={10} />
                  Administrator
                </span>
              ) : (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  <User size={10} />
                  Member
                </span>
              )}
            </div>
          </div>

          <div className="my-6 border-t border-white/8" />

          {/* Quick links */}
          <div className="space-y-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#555568]">Quick Access</p>
            {quickLinks.map(({ href, icon: Icon, label, color, bg }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm font-medium transition-all hover:border-white/15 hover:bg-white/5 hover:text-white"
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${bg}`}>
                  <Icon size={16} className={color} />
                </span>
                {label}
              </Link>
            ))}

            {user.role === "admin" && (
              <>
                <Link
                  href="/admin/products"
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm font-medium transition-all hover:border-white/15 hover:bg-white/5 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border bg-purple-500/10 border-purple-500/20">
                    <Boxes size={16} className="text-purple-400" />
                  </span>
                  My Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm font-medium transition-all hover:border-white/15 hover:bg-white/5 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border bg-pink-500/10 border-pink-500/20">
                    <ClipboardList size={16} className="text-pink-400" />
                  </span>
                  Customer Orders
                </Link>
                <Link
                  href="/admin/add-product"
                  className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm font-medium transition-all hover:border-white/15 hover:bg-white/5 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border bg-blue-500/10 border-blue-500/20">
                    <Plus size={16} className="text-blue-400" />
                  </span>
                  Add Product
                </Link>
              </>
            )}
          </div>

          <div className="my-6 border-t border-white/8" />

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/5 py-3 text-sm font-semibold text-rose-400 transition-all hover:bg-rose-500/10 hover:border-rose-400/40"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
