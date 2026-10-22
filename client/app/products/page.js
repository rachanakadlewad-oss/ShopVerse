"use client"
import { useEffect, useState } from "react"
import { PackageSearch } from "lucide-react"
import API from "../../lib/axios"
import ProductCard from "../../components/ProductCard"
import { ProductCardSkeleton } from "../../components/Loader"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products")
        setProducts(data)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 slide-up">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-zinc-400">Browse our latest collection.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-20 text-center scale-in">
            <PackageSearch className="mb-4 h-12 w-12 text-purple-300" />
            <p className="text-lg font-medium">No products yet</p>
            <p className="mt-1 text-sm text-zinc-400">Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <div
                key={product._id}
                className="slide-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
