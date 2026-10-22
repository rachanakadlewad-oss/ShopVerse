"use client"
import { Toaster } from "sonner"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react"

export default function ToasterProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors={false}
      closeButton
      duration={4500}
      offset={{ top: 80 }}
      gap={8}
      icons={{
        success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
        error: <XCircle className="h-5 w-5 text-rose-400" />,
        warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
        info: <Info className="h-5 w-5 text-blue-400" />,
        loading: <Loader2 className="h-5 w-5 animate-spin text-purple-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-white/10 !bg-zinc-950/95 !backdrop-blur-xl !shadow-2xl !shadow-black/60 !text-white !py-3 !px-4 !gap-3 scale-in",
          title: "!text-sm !font-semibold !text-white",
          description: "!text-xs !text-zinc-400 !mt-0.5",
          closeButton:
            "!bg-white/5 !border-white/10 !text-zinc-400 hover:!text-white hover:!bg-white/10 !rounded-lg",
          actionButton:
            "!bg-purple-500 !text-white !rounded-full !text-xs !font-medium hover:!bg-purple-600",
          cancelButton:
            "!bg-white/10 !text-zinc-300 !rounded-full !text-xs hover:!bg-white/20",
          success:
            "!border-emerald-500/20 !shadow-emerald-500/10",
          error:
            "!border-rose-500/20 !shadow-rose-500/10",
          warning:
            "!border-amber-500/20 !shadow-amber-500/10",
          info:
            "!border-blue-500/20 !shadow-blue-500/10",
        },
      }}
      style={{ zIndex: 9999 }}
    />
  )
}
