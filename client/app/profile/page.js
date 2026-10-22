"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Mail, Package, ShoppingBag } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

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
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-16 text-white">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="flex items-center gap-2 text-sm text-zinc-400">
              <Mail size={14} />
              {user.email}
            </p>
            {user.role === "admin" && (
              <span className="mt-2 inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-200">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <Link
            href="/products"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-purple-400/40"
          >
            <ShoppingBag size={18} className="text-purple-300" />
            Continue shopping
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-purple-400/40"
          >
            <Package size={18} className="text-pink-300" />
            My orders
          </Link>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-rose-400/40 py-3 font-semibold text-rose-200 transition hover:bg-rose-500/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}
