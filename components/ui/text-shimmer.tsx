"use client"

import { CSSProperties, FC, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TextShimmerProps {
  children: ReactNode
  className?: string
  duration?: number
  spread?: number
}

export const TextShimmer: FC<TextShimmerProps> = ({
  children,
  className,
  duration = 2,
  spread = 2,
}) => {
  return (
    <span
      className={cn(
        "inline-block bg-[linear-gradient(110deg,var(--base-color),var(--base-gradient-color),var(--base-color))] bg-clip-text text-transparent",
        className
      )}
      style={
        {
          "--base-color": "#64748b",
          "--base-gradient-color": "#e2e8f0",
          backgroundSize: `${spread * 100}% 100%`,
          animation: `shimmer ${duration}s infinite linear`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  )
}
