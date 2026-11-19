import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] border-2 border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-ink bg-lime text-primary-foreground shadow-[3px_3px_0_var(--ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime-hover hover:shadow-[4px_4px_0_var(--ink)] active:translate-x-0 active:translate-y-0 active:shadow-none",
        outline:
          "border-ink bg-surface text-ink hover:bg-secondary aria-expanded:bg-secondary",
        secondary:
          "border-ink bg-secondary text-secondary-foreground hover:bg-secondary/75 aria-expanded:bg-secondary",
        ghost:
          "border-transparent text-ink hover:bg-secondary aria-expanded:bg-secondary",
        destructive:
          "border-ink bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "border-transparent text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        xs: "h-7 gap-1 rounded-[4px] border px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-[4px] border",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
