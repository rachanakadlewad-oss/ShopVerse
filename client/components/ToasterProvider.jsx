"use client"
import { Toaster } from "sonner"
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

export default function ToasterProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-right"
      richColors={false}
      closeButton
      duration={4500}
      gap={8}
      offset={{ top: 72 }}
      icons={{
        success: <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />,
        error:   <XCircle      className="h-4 w-4 text-rose-400 flex-shrink-0" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />,
        info:    <Info         className="h-4 w-4 text-blue-400 flex-shrink-0" />,
        loading: <Loader2      className="h-4 w-4 animate-spin text-purple-400 flex-shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "!flex !items-start !gap-3 !rounded-2xl !border !border-white/10 !bg-[#16161f]/98 !backdrop-blur-xl !shadow-2xl !shadow-black/50 !text-white !p-4 scale-in",
          title:       "!text-sm !font-semibold !text-white !leading-snug",
          description: "!text-xs !text-[#9898b0] !mt-0.5 !leading-relaxed",
          closeButton:
            "!bg-white/5 !border !border-white/10 !text-[#9898b0] hover:!text-white hover:!bg-white/10 !rounded-lg !w-6 !h-6",
          actionButton:
            "!bg-purple-500 hover:!bg-purple-600 !text-white !rounded-full !text-xs !font-semibold !px-3 !py-1",
          cancelButton:
            "!bg-white/8 hover:!bg-white/12 !text-[#9898b0] !rounded-full !text-xs !px-3 !py-1",
          success: "!border-emerald-500/20",
          error:   "!border-rose-500/20",
          warning: "!border-amber-500/20",
          info:    "!border-blue-500/20",
        },
      }}
      style={{ zIndex: 9999 }}
    />
  )
}
