"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
  User,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    toast.success("Signed out", { description: "See you next time!" })
    router.push("/")
  }

  const navLinkClass = (href) =>
    `flex items-center gap-1.5 text-sm transition-all duration-200 ${
      pathname === href
        ? "text-white font-medium"
        : "text-zinc-400 hover:text-white"
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/85 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href={user ? "/products" : "/"}
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
            <Sparkles size={14} className="text-white" />
          </span>
          ShopEase
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/products" className={navLinkClass("/products")}>
            Products
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin/add-product"
              className={`${navLinkClass("/admin/add-product")} rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 hover:border-purple-400/60 hover:bg-purple-500/20`}
            >
              <Plus size={14} />
              Add Product
            </Link>
          )}

          {user && (
            <>
              <Link
                href="/cart"
                className={`${navLinkClass("/cart")} relative`}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
              </Link>
              <Link href="/orders" className={navLinkClass("/orders")}>
                <Package size={18} />
                <span className="hidden sm:inline">Orders</span>
              </Link>
            </>
          )}

          {/* Auth area */}
          {loading ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-white/8" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 transition-all duration-200 hover:border-purple-400/50 hover:bg-white/10"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold shadow shadow-purple-500/30">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[100px] truncate text-sm sm:inline">
                  {user.name}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="dropdown-enter absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/12 bg-zinc-950/98 shadow-2xl shadow-black/60 backdrop-blur-xl">
                  {/* User info */}
                  <div className="border-b border-white/8 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="p-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-all hover:bg-white/8 hover:text-white"
                    >
                      <User size={15} className="text-purple-400" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-all hover:bg-white/8 hover:text-white"
                    >
                      <Package size={15} className="text-pink-400" />
                      My Orders
                    </Link>
                    <div className="mx-3 my-1 border-t border-white/8" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-rose-400 transition-all hover:bg-rose-500/8 hover:text-rose-300"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm text-zinc-300 transition-all hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-purple-500/40"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
