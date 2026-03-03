"use client"
import { useEffect, useState } from "react"
import API from "../../lib/axios"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await API.get("/orders/my")
      setOrders(data)
    }

    fetchOrders()
  }, [])

  if (orders.length === 0)
    return <p>No orders yet</p>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map(order => (
        <div
          key={order._id}
          className="border p-4 mb-4 rounded"
        >
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
        </div>
      ))}
    </div>
  )
}