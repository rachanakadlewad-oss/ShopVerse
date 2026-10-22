"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Sparkles, ArrowRight, Shield, Zap, Star } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/products")
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            {user ? "Taking you to products…" : "Loading…"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">
      <div className="absolute top-0 left-0 -z-0 h-96 w-96 rounded-full bg-purple-600 opacity-30 blur-3xl" />
      <div className="absolute right-0 bottom-0 -z-0 h-96 w-96 rounded-full bg-pink-600 opacity-30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700 opacity-10 blur-3xl" />

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
        <div>
          <div className="mb-4 flex items-center gap-2 text-purple-400">
            <Sparkles size={18} />
            <span className="text-sm tracking-widest uppercase">
              Premium Shopping Experience
            </span>
          </div>

          <h1 className="text-5xl leading-tight font-extrabold md:text-6xl">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Style &amp; Tech
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-zinc-300">
            Discover high-quality products designed to inspire.
            Secure checkout, fast delivery, and a premium experience — every time.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30"
            >
              <ShoppingBag size={20} />
              Create Account
            </Link>

            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-full border border-zinc-500 px-8 py-4 transition-all duration-300 hover:border-purple-500 hover:text-purple-300"
            >
              Sign In
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 flex gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-1"><Shield size={14} className="text-green-400" /> Secure Payments</span>
            <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-400" /> Fast Delivery</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-purple-400" /> Top Rated</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1512499617640-c2f999098c01?w=600"
              alt="Latest Smart Collection"
              className="w-full rounded-2xl object-cover shadow-xl"
            />

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Latest Smart Collection</h3>
              <p className="mt-2 text-zinc-300">Trendy designs. Modern innovation.</p>

              <Link
                href="/register"
                className="group mt-4 inline-flex items-center gap-1 text-purple-400 transition hover:text-pink-400"
              >
                Get Started
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 bg-black/40 py-20 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 text-center md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="mb-3 text-xl font-semibold">Fast Delivery</h3>
            <p className="text-zinc-400">Lightning-fast shipping across India.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-500/5">
            <div className="mb-3 text-3xl">🔒</div>
            <h3 className="mb-3 text-xl font-semibold">Secure Payments</h3>
            <p className="text-zinc-400">Encrypted and safe checkout experience.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5">
            <div className="mb-3 text-3xl">🌟</div>
            <h3 className="mb-3 text-xl font-semibold">Premium Quality</h3>
            <p className="text-zinc-400">Carefully curated top-rated products.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
