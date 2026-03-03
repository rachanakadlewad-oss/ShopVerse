"use client"
import Link from "next/link"

export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-xl transition">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-cover rounded"
      />

      <h2 className="text-lg font-semibold mt-2">
        {product.title}
      </h2>

      <p className="text-gray-600">₹{product.price}</p>

      <Link
        href={`/products/${product._id}`}
        className="block mt-3 bg-black text-white text-center py-2 rounded hover:bg-gray-800"
      >
        View
      </Link>
    </div>
  )
}