"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Boxes,
  Plus,
  Trash2,
  ExternalLink,
  IndianRupee,
  Package,
  Search,
  Tag,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../../lib/axios"
import Loader, { ButtonSpinner } from "../../../components/Loader"
import { useAuth } from "../../../context/AuthContext"

export default function AdminProductsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Sign in required", { description: "Please sign in as admin to view your products." })
        router.replace("/login")
      } else if (user.role !== "admin") {
        toast.error("Unauthorized", { description: "Admin access required." })
        router.replace("/products")
      } else {
        fetchMyProducts()
      }
    }
  }, [user, authLoading, router])

  const fetchMyProducts = async () => {
    try {
      setLoading(true)
      const { data } = await API.get("/products/admin/my")
      setProducts(data)
    } catch (err) {
      toast.error("Could not load your products", {
        description: err.response?.data?.message || "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to remove "${productTitle}"?`)) return

    try {
      setDeletingId(productId)
      await API.delete(`/products/${productId}`)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      toast.success("Product removed", {
        description: `"${productTitle}" has been deleted from your catalog.`,
      })
    } catch (err) {
      toast.error("Failed to delete product", {
        description: err.response?.data?.message || "Please try again.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || (user && user.role !== "admin")) {
    return <Loader label="Verifying admin access…" />
  }

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  })

  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const lowStockCount = products.filter((p) => (Number(p.stock) || 0) < 5).length

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-pink-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between slide-up">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-400">
                <Boxes size={20} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                Admin Catalog
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My <span className="gradient-text">Products</span>
            </h1>
            <p className="mt-1 text-sm text-[#9898b0]">
              Manage the products created and sold by you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-[#9898b0] hover:text-white hover:border-pink-500/40 hover:bg-white/8 transition-all"
            >
              <ClipboardList size={16} className="text-pink-400" />
              Customer Orders
            </Link>
            <Link
              href="/admin/add-product"
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 slide-up" style={{ animationDelay: "50ms" }}>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Total Products</span>
              <Package size={18} className="text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{products.length}</p>
            <p className="mt-1 text-xs text-[#9898b0]">Active catalog items</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Total Stock</span>
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-400">{totalStock} units</p>
            <p className="mt-1 text-xs text-[#9898b0]">Across all listed items</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/3 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#555568]">Low Stock Alerts</span>
              <AlertTriangle size={18} className={lowStockCount > 0 ? "text-amber-400" : "text-[#555568]"} />
            </div>
            <p className={`mt-2 text-2xl font-bold ${lowStockCount > 0 ? "text-amber-400" : "text-white"}`}>
              {lowStockCount}
            </p>
            <p className="mt-1 text-xs text-[#9898b0]">Items with fewer than 5 units</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
            <input
              type="text"
              placeholder="Search your products by title or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-11 py-3 text-sm"
            />
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <Loader label="Loading your catalog…" />
        ) : filteredProducts.length === 0 ? (
          <div className="slide-up rounded-3xl border border-white/8 bg-white/3 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
              <Boxes size={32} />
            </div>
            <h2 className="text-xl font-bold text-white">
              {search ? "No matching products found" : "You haven't added any products yet"}
            </h2>
            <p className="mt-2 text-sm text-[#9898b0] max-w-md mx-auto">
              {search
                ? `No products match "${search}". Try searching for something else.`
                : "Products you create will appear here. You can manage their inventory, view who ordered them, and change order status."}
            </p>
            {!search && (
              <Link
                href="/admin/add-product"
                className="btn-primary inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm"
              >
                <Plus size={16} />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, i) => {
              const isDeleting = deletingId === product._id
              const isOutOfStock = product.stock <= 0
              const isLowStock = product.stock > 0 && product.stock < 5

              return (
                <div
                  key={product._id}
                  className="slide-up group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 transition-all hover:border-purple-500/30 hover:bg-white/5"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div>
                    {/* Image */}
                    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-white/4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"
                        }}
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300">
                        {product.category || "General"}
                      </span>
                      <span
                        className={`absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border backdrop-blur-md ${
                          isOutOfStock
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : isLowStock
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-base text-white line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#9898b0] line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center text-lg font-bold text-purple-300">
                        <IndianRupee size={15} />
                        {Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-[#555568]">
                        Added {new Date(product.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/4 py-2 text-xs font-medium text-[#9898b0] hover:text-white hover:bg-white/8 transition-all"
                        title="View product in store"
                      >
                        <ExternalLink size={13} />
                        View in Store
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id, product.title)}
                        disabled={isDeleting}
                        className="flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/8 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/15 hover:border-rose-400/40 transition-all"
                        title="Delete product"
                      >
                        {isDeleting ? <ButtonSpinner /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
