import { BRAND } from "@/lib/lumi/brand";
import { cn } from "@/lib/utils";

export function LumiMark({ className }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("text-primary", className)} aria-hidden>
      <rect width="48" height="48" rx="14" fill="currentColor" />
      <circle cx="24" cy="24" r="12" fill="var(--color-bg)" />
      <circle cx="24" cy="24" r="6" fill="var(--color-surface)" />
    </svg>
  );
}

export function LumiLogoTile({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.svg"
      alt=""
      width={32}
      height={32}
      className={cn("size-8 shrink-0 drop-shadow-sm", className)}
    />
  );
}

export function LumiWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LumiLogoTile />
      <span className="font-display text-xl font-medium tracking-tight text-ink">{BRAND.name}</span>
    </span>
  );
}
