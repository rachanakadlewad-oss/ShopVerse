"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import API from "../../../lib/axios"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/${id}`)
      setProduct(data)
    }

    fetchProduct()
  }, [id])

  const addToCart = async () => {
  await API.post("/cart", {
    productId: product._id,
    quantity: 1
  })
  alert("Added to cart")
}

  if (!product) return <p className="px-6 py-10">Loading...</p>

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-6 py-10">
      <img
        src={product.image}
        alt={product.title}
        className="w-full rounded-lg shadow-md"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <p className="text-2xl font-semibold mt-4">
          ₹{product.price}
        </p>

        <button
          onClick={addToCart}
          className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}