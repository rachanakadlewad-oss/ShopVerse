"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  IndianRupee,
  Package,
  ArrowLeft,
  Shield,
  Plus,
  Truck,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import API from "../../lib/axios"
import Loader, { ButtonSpinner } from "../../components/Loader"
import { useAuth } from "../../context/AuthContext"
import AddressManager from "../../components/AddressManager"

const STEPS = ["Address", "Review", "Confirmation"]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
            i < current
              ? "bg-emerald-500 text-white"
              : i === current
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40"
              : "border border-white/15 bg-white/4 text-[#555568]"
          }`}>
            {i < current ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={`ml-2 text-xs font-medium hidden sm:inline ${i === current ? "text-white" : "text-[#555568]"}`}>
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`mx-3 h-px w-8 sm:w-16 transition-colors ${i < current ? "bg-emerald-500" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  // Saved addresses from backend
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [addressesLoading, setAddressesLoading] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Sign in required", { description: "Please sign in to checkout." })
      router.replace("/login")
    }
  }, [user, authLoading, router])

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get("/cart")
        if (!data || !data.items || data.items.length === 0) {
          toast.error("Cart is empty", { description: "Add items before checking out." })
          router.replace("/cart")
          return
        }
        setCart(data)
      } catch (err) {
        toast.error("Couldn't load cart", {
          description: err.response?.data?.message || "Please try again.",
        })
        router.replace("/cart")
      } finally {
        setCartLoading(false)
      }
    }
    if (user) fetchCart()
  }, [user, router])

  // Load saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await API.get("/auth/addresses")
        setSavedAddresses(data || [])
        // Pre-select default address
        const def = data.find((a) => a.isDefault) || data[0]
        if (def) setSelectedAddress(def)
      } catch {
        // Not critical – user can still add a new address
      } finally {
        setAddressesLoading(false)
      }
    }
    if (user) fetchAddresses()
  }, [user])

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("No address selected", { description: "Please select or add a delivery address." })
      return
    }

    // Validate required shipping address fields before sending
    const { name, line1, city, state, pincode } = selectedAddress
    if (!name || !line1 || !city || !state || !pincode) {
      toast.error("Incomplete address", {
        description: "Your saved address is missing required fields. Please edit it before placing the order.",
      })
      return
    }

    setPlacingOrder(true)
    try {
      const { data: order } = await API.post("/orders", { shippingAddress: selectedAddress })
      setConfirmedOrder(order)
      setStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
      toast.success("🎉 Order placed!", {
        description: `Order #${order._id.slice(-8).toUpperCase()} confirmed.`,
        duration: 6000,
      })
    } catch (err) {
      const serverMsg = err.response?.data?.message
      const status = err.response?.status

      if (status === 400) {
        // Meaningful business-logic errors from the server
        toast.error("Could not place order", {
          description: serverMsg || "Please check your cart and address, then try again.",
          duration: 8000,
        })
      } else if (status === 401) {
        toast.error("Session expired", {
          description: "Please sign in again to continue.",
        })
      } else {
        toast.error("Order failed — Server Error", {
          description: serverMsg || "An unexpected error occurred. Please try again in a moment.",
          duration: 8000,
        })
      }
    } finally {
      setPlacingOrder(false)
    }
  }

  if (authLoading || cartLoading) return <Loader label="Preparing checkout…" />

  const items = cart?.items ?? []
  const subtotal = items.reduce((a, i) => a + (i.product?.price ?? 0) * i.quantity, 0)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + gst

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0f] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="mb-8 slide-up text-center">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-1 text-sm text-[#9898b0]">
            {step < 2 ? "Complete your order in a few simple steps" : "Order confirmed!"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-10 slide-up" style={{ animationDelay: "50ms" }}>
          <StepIndicator current={step} />
        </div>

        {/* ── Step 0: Address ── */}
        {step === 0 && (
          <div className="scale-in grid gap-6 lg:grid-cols-3">
            {/* Address section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-white/10 bg-white/3 p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30">
                    <MapPin size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-bold">Delivery Address</h2>
                    <p className="text-xs text-[#9898b0]">Select or add a delivery address</p>
                  </div>
                </div>

                {addressesLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="shimmer h-24 rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <AddressManager
                    addresses={savedAddresses}
                    onAddressesChange={setSavedAddresses}
                    selectedId={selectedAddress?._id}
                    onSelect={setSelectedAddress}
                  />
                )}
              </div>
            </div>

            {/* Mini order summary */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/4 p-5">
                <h3 className="mb-4 text-sm font-bold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.product?._id} className="flex items-center gap-2">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="h-8 w-8 rounded-lg object-cover border border-white/8 flex-shrink-0"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100" }}
                      />
                      <span className="flex-1 truncate text-xs text-[#9898b0]">{item.product?.title}</span>
                      <span className="text-xs font-semibold flex-shrink-0">×{item.quantity}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-[#555568]">+{items.length - 3} more items</p>
                  )}
                </div>

                <div className="my-4 border-t border-white/8" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-purple-300">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <button
                  type="button"
                  disabled={!selectedAddress}
                  onClick={() => {
                    if (!selectedAddress) {
                      toast.error("Please select an address first")
                      return
                    }
                    setStep(1)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }}
                  className="btn-primary mt-5 flex w-full items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/cart")}
                  className="btn-ghost mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm"
                >
                  <ArrowLeft size={14} />
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Review ── */}
        {step === 1 && (
          <div className="scale-in grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              {/* Address review */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-purple-400" />
                    <h3 className="font-semibold text-sm">Delivering To</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                  >
                    Change
                  </button>
                </div>
                {selectedAddress && (
                  <div className="text-sm text-[#9898b0] space-y-1">
                    <p className="font-semibold text-white">{selectedAddress.name}</p>
                    <p>{selectedAddress.line1}</p>
                    <p>{selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}</p>
                    {selectedAddress.phone && (
                      <p className="mt-2 text-[#555568]">📱 {selectedAddress.phone}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Items review */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag size={16} className="text-purple-400" />
                  <h3 className="font-semibold text-sm">Order Items ({items.length})</h3>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product?._id} className="flex items-center gap-3">
                      <img
                        src={item.product?.image}
                        alt={item.product?.title}
                        className="h-14 w-14 rounded-xl object-cover border border-white/8 flex-shrink-0"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.product?.title}</p>
                        <p className="text-xs text-[#9898b0]">Qty: {item.quantity}</p>
                      </div>
                      <p className="flex items-center text-sm font-bold text-purple-300 flex-shrink-0">
                        <IndianRupee size={12} />
                        {((item.product?.price ?? 0) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-[#555568] px-1">
                <Shield size={13} className="text-emerald-400 flex-shrink-0" />
                Your payment and personal data are secured with end-to-end encryption.
              </div>
            </div>

            {/* Price summary + CTA */}
            <div>
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/4 p-5">
                <h3 className="mb-4 text-sm font-bold">Price Details</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9898b0]">Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9898b0] flex items-center gap-1"><Tag size={11} /> GST (18%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9898b0] flex items-center gap-1"><Truck size={11} /> Delivery</span>
                    <span className="text-emerald-400 font-semibold">Free</span>
                  </div>
                  <div className="border-t border-white/8 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-purple-300">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="btn-primary mt-5 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
                >
                  {placingOrder ? (
                    <><ButtonSpinner />Placing Order…</>
                  ) : (
                    <><Package size={16} />Place Order — ₹{total.toLocaleString("en-IN")}</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="btn-ghost mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Confirmation ── */}
        {step === 2 && confirmedOrder && (
          <div className="scale-in text-center">
            {/* Success icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 float">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold">Order Confirmed! 🎉</h2>
            <p className="mt-3 text-[#9898b0]">
              Thank you, {selectedAddress?.name?.split(" ")[0]}! Your order has been placed successfully.
            </p>
            <p className="mt-1 text-sm font-mono text-purple-300">
              Order ID: #{confirmedOrder._id.slice(-8).toUpperCase()}
            </p>

            {/* Summary cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
              {/* Address recap */}
              {selectedAddress && (
                <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                  <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <MapPin size={14} className="text-purple-400" />
                    Delivering to
                  </h3>
                  <p className="font-semibold text-sm text-white">{selectedAddress.name}</p>
                  <p className="text-sm text-[#9898b0] mt-1">
                    {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}
                  </p>
                </div>
              )}

              {/* Price recap */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                <h3 className="mb-3 text-sm font-semibold">Order Total</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#9898b0]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-[#9898b0]">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/8 mt-2">
                    <span>Total Paid</span>
                    <span className="text-purple-300">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push(`/orders/${confirmedOrder._id}`)}
                className="btn-primary flex items-center justify-center gap-2 px-7 py-3 text-sm"
              >
                <Package size={16} />
                View Invoice
              </button>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="btn-ghost flex items-center justify-center gap-2 px-7 py-3 text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
