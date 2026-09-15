import type { AvatarId } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

const face: Record<AvatarId, { ear: string; body: string }> = {
  uil: { ear: "M10 16 L16 6 L22 16", body: "owl" },
  vos: { ear: "fox", body: "fox" },
  beer: { ear: "bear", body: "bear" },
  haas: { ear: "hare", body: "hare" },
  hert: { ear: "deer", body: "deer" },
  egel: { ear: "hedge", body: "hedge" },
};

export function KidAvatar({
  id,
  className,
  size = 56,
}: {
  id: AvatarId;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" fill="var(--color-primary-soft)" />
      {id === "uil" && (
        <>
          <path d="M18 22 L24 10 L32 20 L40 10 L46 22" fill="var(--color-primary)" />
          <circle cx="24" cy="30" r="7" fill="var(--color-surface)" />
          <circle cx="40" cy="30" r="7" fill="var(--color-surface)" />
          <circle cx="24" cy="30" r="3" fill="var(--color-ink)" />
          <circle cx="40" cy="30" r="3" fill="var(--color-ink)" />
          <path d="M30 38 L32 42 L34 38 Z" fill="var(--color-clay)" />
        </>
      )}
      {id === "vos" && (
        <>
          <path d="M16 24 L22 8 L30 22" fill="var(--color-clay)" />
          <path d="M48 24 L42 8 L34 22" fill="var(--color-clay)" />
          <ellipse cx="32" cy="34" rx="16" ry="14" fill="var(--color-clay)" />
          <circle cx="26" cy="32" r="2.4" fill="var(--color-ink)" />
          <circle cx="38" cy="32" r="2.4" fill="var(--color-ink)" />
          <ellipse cx="32" cy="40" rx="4" ry="2.2" fill="var(--color-ink)" />
        </>
      )}
      {id === "beer" && (
        <>
          <circle cx="18" cy="20" r="8" fill="var(--color-ink)" />
          <circle cx="46" cy="20" r="8" fill="var(--color-ink)" />
          <circle cx="18" cy="20" r="4" fill="var(--color-surface-2)" />
          <circle cx="46" cy="20" r="4" fill="var(--color-surface-2)" />
          <ellipse cx="32" cy="36" rx="18" ry="16" fill="var(--color-ink)" />
          <circle cx="26" cy="34" r="2.2" fill="var(--color-surface)" />
          <circle cx="38" cy="34" r="2.2" fill="var(--color-surface)" />
          <ellipse cx="32" cy="42" rx="5" ry="3" fill="var(--color-surface-2)" />
        </>
      )}
      {id === "haas" && (
        <>
          <ellipse cx="22" cy="14" rx="5" ry="14" fill="var(--color-muted)" transform="rotate(-12 22 14)" />
          <ellipse cx="42" cy="14" rx="5" ry="14" fill="var(--color-muted)" transform="rotate(12 42 14)" />
          <ellipse cx="32" cy="36" rx="16" ry="15" fill="var(--color-surface)" stroke="var(--color-muted)" strokeWidth="3" />
          <circle cx="26" cy="34" r="2.2" fill="var(--color-ink)" />
          <circle cx="38" cy="34" r="2.2" fill="var(--color-ink)" />
          <ellipse cx="32" cy="42" rx="3.5" ry="2" fill="var(--color-clay)" />
        </>
      )}
      {id === "hert" && (
        <>
          <path d="M20 22 L16 8 L22 12 L24 6 L26 14" stroke="var(--color-ink)" strokeWidth="2" fill="none" />
          <path d="M44 22 L48 8 L42 12 L40 6 L38 14" stroke="var(--color-ink)" strokeWidth="2" fill="none" />
          <ellipse cx="32" cy="36" rx="16" ry="14" fill="var(--color-clay)" />
          <circle cx="26" cy="34" r="2.2" fill="var(--color-ink)" />
          <circle cx="38" cy="34" r="2.2" fill="var(--color-ink)" />
          <ellipse cx="32" cy="42" rx="3" ry="2" fill="var(--color-ink)" />
        </>
      )}
      {id === "egel" && (
        <>
          <path d="M16 34 L20 18 L24 32 L28 16 L32 32 L36 16 L40 32 L44 18 L48 34" fill="var(--color-ink)" />
          <ellipse cx="32" cy="40" rx="16" ry="12" fill="var(--color-muted)" />
          <circle cx="26" cy="40" r="2" fill="var(--color-ink)" />
          <circle cx="36" cy="40" r="2" fill="var(--color-ink)" />
        </>
      )}
      <title>{face[id].body}</title>
    </svg>
  );
}
