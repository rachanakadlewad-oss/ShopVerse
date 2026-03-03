"use client"
import { useEffect, useState } from "react"
import API from "../../lib/axios"

export default function CartPage() {
  const [cart, setCart] = useState(null)

  useEffect(() => {
    const fetchCart = async () => {
      const { data } = await API.get("/cart")
      setCart(data)
    }

    fetchCart()
  }, [])
  const checkout = async () => {
  await API.post("/orders")
  alert("Order placed successfully!")
  window.location.reload()
}

  const removeItem = async (id) => {
    await API.delete(`/cart/${id}`)
    const { data } = await API.get("/cart")
    setCart(data)
  }

  if (!cart || cart.items.length === 0)
    return <p>Your cart is empty</p>

  const total = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.map(item => (
        <div
          key={item.product._id}
          className="flex justify-between items-center border p-4 mb-4"
        >
          <div>
            <h2>{item.product.title}</h2>
            <p>₹{item.product.price}</p>
          </div>

          <button
            onClick={() => removeItem(item.product._id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-6">
        Total: ₹{total}
      </h2>
      <button
  onClick={checkout}
  className="mt-4 bg-green-600 text-white px-6 py-3 rounded"
>
  Checkout
</button>
    </div>
  )
}