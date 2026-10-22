"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../context/AuthContext"
import Loader, { ButtonSpinner } from "../../components/Loader"

export default function Login() {
  const { login, user, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.replace("/products")
    }
  }, [user, loading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email, password)
      toast.success("Welcome back", { description: "You are signed in." })
      router.push("/products")
    } catch (err) {
      const message = err.response?.data?.message || "Could not sign in. Check your details and try again."
      setError(message)
      toast.error("Sign in failed", { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) {
    return <Loader label={user ? "Taking you to products…" : "Loading…"} />
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-16 text-white">
      <div className="absolute top-16 left-10 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-pink-600/30 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm tracking-widest text-purple-300 uppercase">Welcome back</p>
          <h1 className="mt-2 text-4xl font-bold">Sign in</h1>
          <p className="mt-3 text-zinc-400">Continue shopping with your ShopEase account.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
        >
          {error && (
            <p className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm text-zinc-300">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/15 bg-black/30 py-3 pr-4 pl-10 text-white outline-none placeholder:text-zinc-500 focus:border-purple-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm text-zinc-300">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-black/30 py-3 pr-4 pl-10 text-white outline-none placeholder:text-zinc-500 focus:border-purple-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold shadow-lg shadow-purple-500/20 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <ButtonSpinner />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          New here?{" "}
          <Link href="/register" className="font-medium text-purple-300 hover:text-pink-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
