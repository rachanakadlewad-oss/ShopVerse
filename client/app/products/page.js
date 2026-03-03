"use client"
import { useEffect, useState } from "react"
import API from "../../lib/axios"
import ProductCard from "../../components/ProductCard"

export default function ProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await API.get("/products")
      setProducts(data)
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}