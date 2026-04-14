"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      className="toaster group"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: [
            // base shell — slim, pill-ish, frosted
            "flex items-start gap-3",
            "w-[320px] px-4 py-3 rounded-xl",
            "shadow-lg shadow-black/10",
            "border border-white/10",
            "backdrop-blur-md",
            "text-sm font-medium leading-snug",
          ].join(" "),

          // ── per-type backgrounds & text ──
          success: [
            "bg-emerald-950/90 text-emerald-100 border-emerald-800/60",
            "[&_[data-icon]]:text-emerald-400",
            "[&_[data-description]]:text-emerald-300/70",
          ].join(" "),

          error: [
            "bg-red-950/90 text-red-100 border-red-800/60",
            "[&_[data-icon]]:text-red-400",
            "[&_[data-description]]:text-red-300/70",
          ].join(" "),

          warning: [
            "bg-amber-950/90 text-amber-100 border-amber-700/60",
            "[&_[data-icon]]:text-amber-400",
            "[&_[data-description]]:text-amber-300/70",
          ].join(" "),

          info: [
            "bg-blue-950/90 text-blue-100 border-blue-800/60",
            "[&_[data-icon]]:text-blue-400",
            "[&_[data-description]]:text-blue-300/70",
          ].join(" "),

          loading: [
            "bg-zinc-900/90 text-zinc-100 border-zinc-700/60",
            "[&_[data-icon]]:text-zinc-400",
            "[&_[data-description]]:text-zinc-400/70",
          ].join(" "),

          // description sub-text
          description: "text-[0.78rem] font-normal mt-0.5 opacity-80",

          // close button
          closeButton: [
            "ml-auto shrink-0 opacity-50 hover:opacity-100",
            "transition-opacity rounded-md p-0.5",
            "text-current",
          ].join(" "),

          // progress bar
          actionButton:
            "text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-7 shrink-0 mt-0.5" />,
        info: <InfoIcon className="size-7 shrink-0 mt-0.5" />,
        warning: <TriangleAlertIcon className="size-7 shrink-0 mt-0.5" />,
        error: <OctagonXIcon className="size-7 shrink-0 mt-0.5" />,
        loading: <Loader2Icon className="size-7 shrink-0 mt-0.5 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
