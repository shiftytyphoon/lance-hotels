import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex relative uppercase border font-mono cursor-pointer items-center font-medium justify-center gap-2 whitespace-nowrap ease-out transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary border-primary text-black font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        primary: "bg-primary border-primary text-black font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        secondary: "bg-white/10 text-white border-white/20 rounded-lg backdrop-blur-sm hover:bg-white/20 hover:border-white/30",
        outline: "bg-transparent border-white/20 text-white rounded-lg hover:bg-white/5 hover:border-white/40",
        ghost: "bg-transparent border-transparent text-white rounded-lg hover:bg-white/10",
      },
      size: {
        default: "h-14 px-8 text-sm",
        sm: "h-12 px-6 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-16 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Slottable>
        {children}
      </Slottable>
    </Comp>
  )
}

export { Button, buttonVariants }
