"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShoppingCart,
  Package,
  User,
  LogOut,
  Plus,
  ChevronDown,
  Search,
  Zap,
  Menu,
  X,
  Boxes,
  ClipboardList,
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const menuRef = useRef(null)
  const mobileRef = useRef(null)

  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close menus on route change
  useEffect(() => {
    setProfileOpen(false)
    setMobileOpen(false)
  }, [pathname])

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Click-outside to close profile dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setProfileOpen(false)
      if (mobileRef.current && !mobileRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    toast.success("Signed out", { description: "Come back soon!" })
    router.push("/")
  }

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/")

  const navLink = (href, label, Icon) => (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive(href)
          ? "text-purple-300 bg-purple-500/10"
          : "text-[#9898b0] hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </Link>
  )

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-[#0a0a0f]/95 shadow-lg shadow-black/40 backdrop-blur-xl"
          : "border-b border-transparent bg-[#0a0a0f]/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ── Logo ── */}
        <Link
          href={user ? "/products" : "/"}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-105">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Shop<span className="gradient-text">Verse</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden items-center gap-1 md:flex">
          {navLink("/products", "Store")}
          {user?.role === "admin" ? (
            <>
              {navLink("/admin/products", "My Products", Boxes)}
              {navLink("/admin/orders", "Customer Orders", ClipboardList)}
              {navLink("/admin/add-product", "Add Product", Plus)}
            </>
          ) : (
            <>
              {user && navLink("/cart", "Cart", ShoppingCart)}
              {user && navLink("/orders", "Orders", Package)}
            </>
          )}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Search shortcut */}
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 bg-white/4 text-sm text-[#555568] hover:text-white hover:border-white/15 transition-all"
            aria-label="Search products"
          >
            <Search size={14} />
            <span className="hidden lg:inline">Search…</span>
          </button>

          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/8" />
          ) : user ? (
            /* Profile dropdown */
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 py-1 transition-all hover:border-purple-500/40 hover:bg-white/8"
                aria-expanded={profileOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold shadow shadow-purple-500/40">
                  {(user.name || "U")[0].toUpperCase()}
                </span>
                <span className="hidden max-w-[90px] truncate text-sm font-medium sm:block">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-[#9898b0] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="slide-down absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#16161f]/98 shadow-2xl shadow-black/60 backdrop-blur-xl">
                  {/* User info */}
                  <div className="border-b border-white/8 px-4 py-3">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-[#555568]">{user.email}</p>
                    {user.role === "admin" && (
                      <span className="mt-1 inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-medium text-purple-300 border border-purple-500/20">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {user.role === "admin" ? (
                      <>
                        <Link href="/admin/products" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <Boxes size={15} className="text-purple-400" />
                          My Products
                        </Link>
                        <Link href="/admin/orders" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <ClipboardList size={15} className="text-pink-400" />
                          Customer Orders
                        </Link>
                        <Link href="/admin/add-product" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <Plus size={15} className="text-emerald-400" />
                          Add Product
                        </Link>
                        <Link href="/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <User size={15} className="text-blue-400" />
                          Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/profile" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <User size={15} className="text-purple-400" />
                          Profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <Package size={15} className="text-pink-400" />
                          My Orders
                        </Link>
                        <Link href="/cart" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#9898b0] transition-all hover:bg-white/8 hover:text-white">
                          <ShoppingCart size={15} className="text-emerald-400" />
                          Cart
                        </Link>
                      </>
                    )}
                    <div className="mx-2 my-1 border-t border-white/8" />
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
            /* Auth links */
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#9898b0] hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-primary px-5 py-2 text-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex items-center justify-center rounded-xl p-2 text-[#9898b0] hover:text-white hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="slide-down border-t border-white/8 bg-[#0a0a0f]/98 px-4 py-4 space-y-1 md:hidden"
        >
          <MobileLink href="/products" label="Store" active={isActive("/products")} />
          {user?.role === "admin" ? (
            <>
              <MobileLink href="/admin/products" label="My Products" Icon={Boxes} active={isActive("/admin/products")} />
              <MobileLink href="/admin/orders" label="Customer Orders" Icon={ClipboardList} active={isActive("/admin/orders")} />
              <MobileLink href="/admin/add-product" label="Add Product" Icon={Plus} active={isActive("/admin/add-product")} />
              <MobileLink href="/profile" label="Profile" Icon={User} active={isActive("/profile")} />
            </>
          ) : (
            <>
              {user && <MobileLink href="/cart" label="Cart" Icon={ShoppingCart} active={isActive("/cart")} />}
              {user && <MobileLink href="/orders" label="Orders" Icon={Package} active={isActive("/orders")} />}
              {user && <MobileLink href="/profile" label="Profile" Icon={User} active={isActive("/profile")} />}
            </>
          )}
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/8 transition-all"
            >
              <LogOut size={15} />
              Sign out
            </button>
          )}
          {!user && !loading && (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center rounded-xl border border-white/10 py-2.5 text-sm text-[#9898b0] hover:text-white">Sign in</Link>
              <Link href="/register" className="flex-1 text-center btn-primary py-2.5 text-sm">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function MobileLink({ href, label, Icon, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        active ? "text-purple-300 bg-purple-500/10" : "text-[#9898b0] hover:text-white hover:bg-white/5"
      }`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </Link>
  )
}
