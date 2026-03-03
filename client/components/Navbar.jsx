"use client"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"

export default function Navbar() {
    const { user } = useContext(AuthContext)
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        ShopEase
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/products">Products</Link>
         {user?.role === "admin" && (
    <Link href="/admin/add-product">Add Product</Link>
  )}
        <Link href="/cart">
          <ShoppingCart />
        </Link>
        <Link href="/login">
          <User />
        </Link>
      </div>
    </nav>
  )
}