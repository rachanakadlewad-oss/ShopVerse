"use client"
import Link from "next/link"
import { ArrowRight, IndianRupee } from "lucide-react"

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-purple-500/10">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <h2 className="line-clamp-1 text-lg font-semibold text-white">{product.title}</h2>
        <p className="mt-2 flex items-center gap-0.5 text-purple-300">
          <IndianRupee size={16} />
          <span className="font-semibold">{product.price}</span>
        </p>

        <Link
          href={`/products/${product._id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20"
        >
          View details
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
