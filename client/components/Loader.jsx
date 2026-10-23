"use client"
import { Loader2 } from "lucide-react"

/** Inline spinner for buttons */
export function ButtonSpinner({ size = 16, className = "" }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`}
      aria-hidden="true"
    />
  )
}

/** Full-page loading screen */
export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#0a0a0f]">
      <div className="slide-up flex flex-col items-center gap-6">
        {/* Double ring spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-purple-500 border-r-pink-500" style={{ animationDuration: "0.8s" }} />
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-purple-400/60" style={{ animationDuration: "1.4s", animationDirection: "reverse" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-80" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium tracking-widest text-[#9898b0] uppercase">{label}</p>
          {/* Bouncing dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-purple-500"
                style={{
                  animation: `bounceDot 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Skeleton for a product card */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      <div className="shimmer h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-4 w-3/4 rounded-full" />
        <div className="shimmer h-3 w-1/2 rounded-full" />
        <div className="shimmer h-10 w-full rounded-full mt-4" />
      </div>
    </div>
  )
}

/** Skeleton for a single cart row */
export function CartRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/8 p-4">
      <div className="shimmer h-16 w-16 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-4 w-2/3 rounded-full" />
        <div className="shimmer h-3 w-1/3 rounded-full" />
      </div>
      <div className="shimmer h-9 w-24 rounded-full flex-shrink-0" />
    </div>
  )
}

/** Generic section skeleton (3 lines) */
export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`shimmer h-4 rounded-full ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  )
}
