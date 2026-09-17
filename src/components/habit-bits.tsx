import { Award, Flame, Hexagon, Sparkles, Star, Target, Trophy, Zap, BookOpen, Compass, Shield, Crown } from "lucide-react";
import { BADGE_BY_ID, badgeTitle, type BadgeId, type BadgeWorld, type LevelInfo, type WeekDot } from "@/lib/lumi/loop";
import { levelTitle, questSlots, roundMark } from "@/lib/lumi/rewards";
import { cn } from "@/lib/utils";

const ICONS: Record<BadgeId, typeof Star> = {
  eerste: Sparkles,
  perfect: Star,
  combo5: Zap,
  combo8: Flame,
  dagen3: Target,
  dagen7: Trophy,
  sterren3: Star,
  meester: Award,
  ontdekker: Hexagon,
  groei: Trophy,
  rekenheld: Star,
  taalster: BookOpen,
  wereldreiziger: Compass,
  vraagbaas: Sparkles,
  dapper: Shield,
  goud: Crown,
};

export function StreakRing({
  days,
  atRisk,
  className,
}: {
  days: number;
  atRisk?: boolean;
  className?: string;
}) {
  const cap = 7;
  const pct = Math.min(1, days / cap);
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative grid size-16 place-items-center", atRisk && "lumi-glow", className)}>
      <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <p className="relative font-display text-xl tabular-nums leading-none">{days}</p>
    </div>
  );
}

export function WeekStrip({ dots }: { dots: WeekDot[] }) {
  return (
    <ol className="flex items-center justify-between gap-1" aria-label="Deze week">
      {dots.map((d) => (
        <li key={d.key} className="flex flex-1 flex-col items-center gap-1">
          <span
            className={cn(
              "size-2.5 rounded-full",
              d.done ? "bg-primary" : "bg-surface-2",
              d.today && "ring-2 ring-primary/40 ring-offset-2 ring-offset-bg",
            )}
          />
          <span className={cn("text-[10px] uppercase tracking-wider", d.today ? "text-ink" : "text-faint")}>
            {d.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function XpBar({
  info,
  className,
  world,
}: {
  info: LevelInfo;
  className?: string;
  world?: BadgeWorld;
}) {
  const title = world ? levelTitle(info.level, world) : `Niveau ${info.level}`;
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs tabular-nums text-muted">
          {info.into}/{info.need} XP
        </p>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${info.pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-faint">Nog {Math.max(0, info.need - info.into)} XP tot {world ? levelTitle(info.level + 1, world) : `niveau ${info.level + 1}`}</p>
    </div>
  );
}

export function BadgeMark({
  id,
  size = 36,
  lit = true,
  world = "bos",
}: {
  id: BadgeId;
  size?: number;
  lit?: boolean;
  world?: BadgeWorld;
}) {
  const Icon = ICONS[id];
  const meta = BADGE_BY_ID[id];
  const title = badgeTitle(id, world);
  return (
    <span
      className={cn(
        "inline-grid place-items-center overflow-hidden rounded-full",
        lit ? "bg-primary text-primary-fg shadow-[var(--shadow-card)]" : "bg-surface-2 text-faint",
        world === "ster" && lit && "ring-2 ring-primary/50",
        world === "kampioen" && lit && "ring-2 ring-ink/30",
      )}
      style={{ width: size, height: size }}
      title={title}
      aria-label={title}
    >
      {lit ? (
        <img src={meta.art} alt="" width={size} height={size} className="size-full object-cover" />
      ) : (
        <Icon style={{ width: size * 0.46, height: size * 0.46 }} />
      )}
    </span>
  );
}

export function BadgeRow({ ids, world = "bos" }: { ids: BadgeId[]; world?: BadgeWorld }) {
  if (ids.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {ids.map((id) => (
        <li key={id} className="flex items-center gap-2 rounded-full bg-surface px-2 py-1 shadow-[var(--shadow-card)]">
          <BadgeMark id={id} size={28} world={world} />
          <span className="pr-1 text-xs font-medium">{badgeTitle(id, world)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Confetti({ on }: { on: boolean }) {
  if (!on) return null;
  const bits = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-8 h-40 overflow-hidden" aria-hidden>
      {bits.map((i) => (
        <span
          key={i}
          className="lumi-fall absolute top-0 size-2 rounded-[2px]"
          style={{
            left: `${6 + ((i * 17) % 88)}%`,
            animationDelay: `${(i % 7) * 40}ms`,
            background: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-clay)" : "var(--color-ok)",
            ["--dx" as string]: `${(i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 4)}px`,
          }}
        />
      ))}
    </div>
  );
}

export function RoundStars({ n, world = "bos" }: { n: number; world?: BadgeWorld }) {
  const mark = roundMark(world);
  return (
    <div className="flex justify-center gap-3" aria-label={`${n} van 3 ${mark.many}`}>
      {[1, 2, 3].map((i) => (
        <img
          key={i}
          src={mark.art}
          alt=""
          width={48}
          height={48}
          className={cn(
            "size-12 rounded-full object-cover shadow-[var(--shadow-card)]",
            i <= n ? "lumi-star-in" : "opacity-25 grayscale",
          )}
          style={{ animationDelay: `${(i - 1) * 120}ms` }}
        />
      ))}
    </div>
  );
}

export function DailyQuest({
  done,
  world = "bos",
  line,
}: {
  done: number;
  world?: BadgeWorld;
  line: string;
}) {
  const mark = roundMark(world);
  const slots = questSlots(done);
  return (
    <div>
      <div className="flex items-center gap-3">
        {slots.map((s) => (
          <div key={s.kind} className="flex flex-col items-center gap-1">
            <img
              src={mark.art}
              alt=""
              width={40}
              height={40}
              className={cn(
                "size-10 rounded-full object-cover shadow-[var(--shadow-card)]",
                s.filled ? "" : "opacity-25 grayscale",
              )}
            />
            <span className="text-[10px] uppercase tracking-wider text-faint">
              {s.kind === "dag" ? "Dag" : "Bonus"}
            </span>
          </div>
        ))}
        <p className="min-w-0 flex-1 text-sm text-muted">{line}</p>
      </div>
    </div>
  );
}

export function ComboHud({ n }: { n: number }) {
  if (n < 2) return null;
  return (
    <p
      key={n}
      className={cn(
        "lumi-burst text-center text-xs font-medium uppercase tracking-[0.14em]",
        n >= 5 ? "text-primary" : "text-clay",
      )}
    >
      {n} op rij
    </p>
  );
}

export function XpPops({ items }: { items: { id: number; n: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center" aria-hidden>
      {items.map((it) => (
        <span key={it.id} className="lumi-float absolute font-display text-lg text-ok">
          +{it.n} XP
        </span>
      ))}
    </div>
  );
}
