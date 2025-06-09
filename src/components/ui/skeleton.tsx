// src/components/ui/skeleton.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Remove the empty interface and use type directly
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
