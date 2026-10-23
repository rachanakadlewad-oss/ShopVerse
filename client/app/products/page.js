"use client"
import { useEffect, useMemo, useState, useCallback } from "react"
import { Search, SlidersHorizontal, X, PackageSearch, ChevronDown } from "lucide-react"
import API from "../../lib/axios"
import ProductCard from "../../components/ProductCard"
import { ProductCardSkeleton } from "../../components/Loader"

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc",   label: "Name: A–Z" },
]

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [sort, setSort] = useState("newest")
  const [sortOpen, setSortOpen] = useState(false)

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

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category || "General"))]
    return ["All", ...cats.filter(Boolean).sort()]
  }, [products])

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }

    // Category
    if (activeCategory !== "All") {
      result = result.filter((p) => (p.category || "General") === activeCategory)
    }

    // Sort
    switch (sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break
      case "price-desc": result.sort((a, b) => b.price - a.price); break
      case "name-asc":   result.sort((a, b) => a.title.localeCompare(b.title)); break
      case "newest":
      default:           result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [products, search, activeCategory, sort])

  const clearSearch = useCallback(() => setSearch(""), [])

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="mb-8 slide-up">
          <h1 className="text-3xl font-bold">
            All <span className="gradient-text">Products</span>
          </h1>
          <p className="mt-1 text-sm text-[#9898b0]">
            {loading ? "Loading…" : `${filtered.length} of ${products.length} products`}
          </p>
        </div>

        {/* ── Search + Sort bar ── */}
        <div className="mb-6 flex flex-wrap items-center gap-3 slide-up" style={{ animationDelay: "50ms" }}>
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-base pl-10 pr-10 py-2.5 text-sm rounded-xl"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555568] hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[#9898b0] hover:text-white hover:border-white/20 transition-all whitespace-nowrap"
            >
              <SlidersHorizontal size={14} />
              {currentSortLabel}
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="slide-down absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#16161f]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setSort(opt.value); setSortOpen(false) }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition-all ${
                      sort === opt.value
                        ? "bg-purple-500/15 text-purple-300"
                        : "text-[#9898b0] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {opt.label}
                    {sort === opt.value && <span className="ml-auto text-purple-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Category filter chips ── */}
        {!loading && categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2 slide-up" style={{ animationDelay: "100ms" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-purple-500/60 bg-purple-500/20 text-purple-300"
                    : "border-white/10 bg-white/4 text-[#9898b0] hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="scale-in flex flex-col items-center justify-center rounded-3xl border border-white/8 bg-white/3 py-20 text-center">
            <PackageSearch className="mb-4 h-14 w-14 text-purple-400/60" />
            <p className="text-xl font-semibold">No products found</p>
            <p className="mt-2 max-w-xs text-sm text-[#9898b0]">
              {search
                ? `No results for "${search}". Try a different search.`
                : "No products in this category yet."}
            </p>
            {(search || activeCategory !== "All") && (
              <button
                type="button"
                onClick={() => { clearSearch(); setActiveCategory("All") }}
                className="mt-6 btn-ghost px-6 py-2.5 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product._id} product={product} animDelay={i * 40} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
