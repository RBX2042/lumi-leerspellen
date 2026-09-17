import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Burst = {
  id: number;
  x: number;
  y: number;
  ok: boolean;
};

export function PlayBursts({ items }: { items: Burst[] }) {
  if (items.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((b) => (
        <span key={b.id} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          {Array.from({ length: 10 }, (_, i) => (
            <i
              key={i}
              className="lumi-spark absolute block size-1.5 rounded-full"
              style={{
                background: b.ok
                  ? i % 2 === 0
                    ? "var(--color-primary)"
                    : "var(--color-ok)"
                  : "var(--color-danger)",
                ["--sx" as string]: `${Math.cos((i / 10) * Math.PI * 2) * (18 + (i % 3) * 10)}px`,
                ["--sy" as string]: `${Math.sin((i / 10) * Math.PI * 2) * (18 + (i % 3) * 10)}px`,
                animationDelay: `${i * 12}ms`,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export function ComboBanner({ n }: { n: number }) {
  const [flash, setFlash] = useState(n);
  useEffect(() => setFlash(n), [n]);
  if (n < 2) return null;
  return (
    <div
      key={flash}
      className={cn(
        "lumi-combo-pop pointer-events-none mx-auto mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.16em]",
        n >= 8 ? "bg-primary text-primary-fg" : n >= 5 ? "bg-clay text-primary-fg" : "bg-primary-soft text-clay",
      )}
    >
      <span className="tabular-nums">{n}×</span>
      <span>{n >= 8 ? "vuur" : n >= 5 ? "combo" : "op rij"}</span>
    </div>
  );
}

export function HitFlash({ kind }: { kind: "pop" | "shake" | null }) {
  if (!kind) return null;
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[2rem]",
        kind === "pop" ? "lumi-flash-ok" : "lumi-flash-no",
      )}
      aria-hidden
    />
  );
}
