
"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
}

export function LoadingBar({
  isLoading,
  className,
  ...props
}: LoadingBarProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + (10 * Math.random());
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (progress === 0 && !isLoading) {
    return null;
  }

  return (
    <div 
      className={cn("fixed top-0 left-0 right-0 z-50", className)}
      {...props}
    >
      <Progress value={progress} className="h-1 rounded-none bg-secondary" />
    </div>
  );
}
