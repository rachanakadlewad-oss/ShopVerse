"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export default function Register() {
  const { register, user, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
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
      await register(name, email, password)
      router.push("/products")
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || user) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-6 py-16 text-white">
      <div className="absolute top-16 right-10 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-pink-600/30 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm tracking-widest text-purple-300 uppercase">Join ShopEase</p>
          <h1 className="mt-2 text-4xl font-bold">Create account</h1>
          <p className="mt-3 text-zinc-400">Start shopping with a free account in seconds.</p>
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
            <span className="mb-2 block text-sm text-zinc-300">Name</span>
            <div className="relative">
              <User size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-white/15 bg-black/30 py-3 pr-4 pl-10 text-white outline-none placeholder:text-zinc-500 focus:border-purple-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </label>

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
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/15 bg-black/30 py-3 pr-4 pl-10 text-white outline-none placeholder:text-zinc-500 focus:border-purple-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-purple-300 hover:text-pink-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
