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
        "text-xs font-medium uppercase tracking-[0.18em]",
        onInk ? "text-primary-fg/55" : "text-faint",
        className,
      )}
    >
      {children}
    </p>
  );
}
