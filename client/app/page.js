"use client"
import Link from "next/link"
import { ShoppingBag, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full -z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 opacity-30 blur-3xl rounded-full -z-0"></div>

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <Sparkles size={18} />
            <span className="uppercase text-sm tracking-widest">
              Premium Shopping Experience
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Style & Tech
            </span>
          </h1>

          <p className="mt-6 text-zinc-300 text-lg max-w-lg">
            Discover high-quality products designed to inspire.
            Secure checkout, fast delivery, and premium experience.
          </p>

          <div className="mt-10 flex gap-6">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition transform"
            >
              <ShoppingBag size={20} />
              Shop Now
            </Link>

            <Link
              href="/register"
              className="px-8 py-4 rounded-full border border-zinc-500 hover:bg-white hover:text-black transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - GLASS CARD */}
        <div className="relative">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:scale-105 transition transform duration-500">

            <img
              src="https://images.unsplash.com/photo-1512499617640-c2f999098c01"
              alt="Product"
              className="rounded-2xl shadow-xl"
            />

            <div className="mt-6">
              <h3 className="text-xl font-semibold">
                Latest Smart Collection
              </h3>
              <p className="text-zinc-300 mt-2">
                Trendy designs. Modern innovation.
              </p>

              <Link
                href="/products"
                className="inline-block mt-4 text-purple-400 hover:text-pink-400 transition"
              >
                Explore →
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* FEATURE STRIP */}
      <section className="relative z-10 py-20 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">

          <div className="hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-3">
              ⚡ Fast Delivery
            </h3>
            <p className="text-zinc-400">
              Lightning-fast shipping across India.
            </p>
          </div>

          <div className="hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-3">
              🔒 Secure Payments
            </h3>
            <p className="text-zinc-400">
              Encrypted and safe checkout experience.
            </p>
          </div>

          <div className="hover:scale-105 transition transform">
            <h3 className="text-xl font-semibold mb-3">
              🌟 Premium Quality
            </h3>
            <p className="text-zinc-400">
              Carefully curated top-rated products.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}