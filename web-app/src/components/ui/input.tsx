
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, placeholder, ...props }, ref) => {
    // Add a '+' prefix to placeholder text for telephone inputs if it doesn't already have one
    let placeholderText = placeholder;
    if (type === 'tel' && typeof placeholder === 'string' && !placeholder.startsWith('+')) {
      placeholderText = `+${placeholder}`;
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        placeholder={placeholderText}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
