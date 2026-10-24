"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, Eye, EyeOff, Zap } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../context/AuthContext"
import Loader, { ButtonSpinner } from "../../components/Loader"

export default function Login() {
  const { login, user, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace("/products")
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success("Welcome back!", { description: "You are now signed in." })
      router.push("/products")
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials. Please try again."
      setError(message)
      toast.error("Sign in failed", { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) {
    return <Loader label={user ? "Redirecting…" : "Loading…"} />
  }

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-16">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-pink-600/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/30">
            <Zap size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold">Sign in to ShopVerse</h1>
            <p className="mt-1.5 text-sm text-[#9898b0]">Continue your shopping journey</p>
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
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary mt-2 flex w-full items-center justify-center gap-2 py-3.5 text-sm"
            >
              {submitting ? (
                <><ButtonSpinner />Signing in…</>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9898b0]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
