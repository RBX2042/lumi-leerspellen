import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({
  children,
  className,
  onInk = false,
}: {
  children: ReactNode;
  className?: string;
  onInk?: boolean;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]",
        onInk ? "text-primary-fg/55" : "text-faint",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          onInk ? "bg-primary" : "bg-primary/80",
        )}
        aria-hidden
      />
      {children}
    </p>
  );
}
