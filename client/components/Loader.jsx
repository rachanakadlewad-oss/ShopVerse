"use client"
import { Loader2 } from "lucide-react"

/**
 * ButtonSpinner — inline spinner for use inside buttons.
 * Uses Lucide Loader2 with spin animation.
 */
export function ButtonSpinner({ className = "h-4 w-4" }) {
  return (
    <Loader2
      className={`animate-spin ${className}`}
      aria-hidden="true"
      role="status"
    />
  )
}

/**
 * Full-page / section Loader with shimmer effect.
 */
export default function Loader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800">
      <div className="flex flex-col items-center gap-5 slide-up">
        {/* Spinner ring */}
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-full border-2 border-purple-500/20" />
          <div className="absolute h-14 w-14 animate-spin rounded-full border-2 border-transparent border-t-purple-400 border-r-pink-400" />
          <Loader2 className="absolute h-6 w-6 animate-spin text-purple-300" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium tracking-widest text-zinc-300 uppercase">{label}</p>
          {/* Animated dots */}
          <div className="flex gap-1 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton card placeholder — use while loading product grids.
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="h-48 w-full shimmer rounded-t-2xl" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 shimmer rounded-full" />
        <div className="h-4 w-1/2 shimmer rounded-full" />
        <div className="mt-2 h-9 w-full shimmer rounded-full" />
      </div>
    </div>
  )
}
