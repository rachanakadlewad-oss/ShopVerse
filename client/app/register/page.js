"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail, User, Eye, EyeOff, Zap, CheckCircle2, Shield } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../context/AuthContext"
import Loader, { ButtonSpinner } from "../../components/Loader"


const REQUIREMENTS = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "Contains a letter", test: (p) => /[a-zA-Z]/.test(p) },
]

export default function Register() {
  const { register, user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/admin/products")
      } else {
        router.replace("/products")
      }
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const data = await register(name, email, password, role)
      if (data?.role === "admin" || role === "admin") {
        toast.success("Admin Account created!", { description: "Welcome to your Admin Portal." })
        router.push("/admin/products")
      } else {
        toast.success("Account created!", { description: "Welcome to ShopVerse." })
        router.push("/products")
      }
    } catch (err) {
      const message = err.response?.data?.message || "Could not create your account. Try again."
      setError(message)
      toast.error("Registration failed", { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) {
    return <Loader label={user ? "Taking you to products…" : "Loading…"} />
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-pink-600/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/30">
            <Zap size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Join ShopVerse</p>
            <h1 className="mt-1 text-3xl font-bold">Create your account</h1>
            <p className="mt-1.5 text-sm text-[#9898b0]">Start your premium shopping journey</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 p-8 backdrop-blur-sm shadow-2xl">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/8 px-4 py-3">
              <span className="text-rose-400 mt-0.5">⚠</span>
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="input-base pl-10 py-3 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="input-base pl-10 py-3 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="input-base pl-10 pr-11 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555568] hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {REQUIREMENTS.map((req) => (
                    <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${req.test(password) ? "text-emerald-400" : "text-[#555568]"}`}>
                      <CheckCircle2 size={11} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Selection Dropdown */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
                Select Role <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-base pl-10 pr-10 py-3 text-sm appearance-none bg-[#111118] cursor-pointer"
                >
                  <option value="user">User (Customer)</option>
                  <option value="admin">Admin (Manage Products & Orders)</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#555568]">
                  ▼
                </div>
              </div>
              <p className="mt-1.5 text-[11px] text-[#9898b0]">
                {role === "admin"
                  ? "Admin: Add products, view your catalog, and manage orders placed for your products."
                  : "User: Browse items, shop, and track your personal orders."}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
            >
              {submitting ? (
                <><ButtonSpinner />Creating account…</>
              ) : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9898b0]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
