"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogOut, ShoppingCart, User } from "lucide-react"
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
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={user ? "/products" : "/"} className="text-xl font-bold tracking-tight">
          ShopEase
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/products" className="text-zinc-300 transition hover:text-white">
            Products
          </Link>

          {user?.role === "admin" && (
            <Link href="/admin/add-product" className="text-zinc-300 transition hover:text-white">
              Add Product
            </Link>
          )}

          {user && (
            <>
              <Link href="/cart" className="text-zinc-300 transition hover:text-white" aria-label="Cart">
                <ShoppingCart size={20} />
              </Link>
              <Link href="/orders" className="text-zinc-300 transition hover:text-white">
                Orders
              </Link>
            </>
          )}

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 transition hover:border-purple-400/50 hover:bg-white/10"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-semibold">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.name}</span>
                <ChevronDown size={14} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-zinc-400">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-white/10"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rose-300 transition hover:bg-white/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-zinc-300 transition hover:text-white">
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-medium text-white shadow-lg shadow-purple-500/20 transition hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
