import { PROVINCE_LIST } from "@/lib/lumi/questions";
import type { ShapeItem, Visual } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

const fillMap: Record<ShapeItem["fill"], string> = {
  teal: "var(--color-primary)",
  ink: "var(--color-ink)",
  clay: "var(--color-clay)",
  paper: "var(--color-surface-2)",
};

function Shape({ item, size = 44 }: { item: ShapeItem; size?: number }) {
  const f = fillMap[item.fill];
  if (item.shape === "circle") {
    return <svg width={size} height={size} viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill={f} /></svg>;
  }
  if (item.shape === "square") {
    return <svg width={size} height={size} viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill={f} /></svg>;
  }
  if (item.shape === "triangle") {
    return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M20 6 L34 32 L6 32 Z" fill={f} /></svg>;
  }
  return <svg width={size} height={size} viewBox="0 0 40 40"><path d="M20 4 L36 20 L20 36 L4 20 Z" fill={f} /></svg>;
}

function glowNumberFor(minutes: number): number {
  if (minutes % 5 !== 0) return Math.round(minutes / 5) || 12;
  const n = minutes / 5;
  return n === 0 ? 12 : n;
}

function AnalogClock({
  hours,
  minutes,
  glow,
}: {
  hours: number;
  minutes: number;
  glow?: boolean;
}) {
  const h = ((hours % 12) + minutes / 60) * 30;
  const m = minutes * 6;
  const glowAt = glow ? glowNumberFor(minutes) : null;
  return (
    <svg viewBox="0 0 200 200" className="mx-auto size-52 max-w-full">
      <circle cx="100" cy="100" r="94" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2;
        const inner = 100 + Math.cos(a) * 82;
        const iny = 100 + Math.sin(a) * 82;
        const outer = 100 + Math.cos(a) * 90;
        const ouy = 100 + Math.sin(a) * 90;
        return (
          <line
            key={`t${n}`}
            x1={inner}
            y1={iny}
            x2={outer}
            y2={ouy}
            stroke="var(--color-ink)"
            strokeWidth={n % 3 === 0 ? 3 : 1.5}
          />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n / 12) * Math.PI * 2 - Math.PI / 2;
        const x = 100 + Math.cos(a) * 68;
        const y = 100 + Math.sin(a) * 68;
        const on = glowAt === n;
        return (
          <text
            key={n}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={on ? 18 : 14}
            fontWeight={on ? 700 : 500}
            fontFamily="Lexend, sans-serif"
            fill={on ? "var(--color-primary)" : "var(--color-ink)"}
          >
            {n}
          </text>
        );
      })}
      <line
        x1="100"
        y1="100"
        x2={100 + Math.sin((h * Math.PI) / 180) * 42}
        y2={100 - Math.cos((h * Math.PI) / 180) * 42}
        stroke="var(--color-ink)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="100"
        x2={100 + Math.sin((m * Math.PI) / 180) * 62}
        y2={100 - Math.cos((m * Math.PI) / 180) * 62}
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="100" cy="100" r="5" fill="var(--color-ink)" />
    </svg>
  );
}

const MAP: { id: string; d: string }[] = [
  { id: "groningen", d: "M132 18 L168 22 L170 48 L138 52 L128 34 Z" },
  { id: "friesland", d: "M88 20 L128 18 L128 44 L90 52 L70 40 L74 22 Z" },
  { id: "drenthe", d: "M128 48 L168 50 L166 78 L130 82 L122 60 Z" },
  { id: "overijssel", d: "M122 78 L164 80 L160 112 L118 114 L110 92 Z" },
  { id: "flevoland", d: "M88 78 L118 80 L114 104 L86 108 L78 92 Z" },
  { id: "gelderland", d: "M108 112 L158 110 L154 150 L108 154 L96 132 Z" },
  { id: "utrecht", d: "M82 112 L108 114 L104 136 L78 138 L74 122 Z" },
  { id: "noord-holland", d: "M58 40 L88 38 L90 78 L70 92 L48 70 L50 48 Z" },
  { id: "zuid-holland", d: "M48 88 L78 92 L80 122 L52 136 L36 110 Z" },
  { id: "zeeland", d: "M28 130 L58 128 L62 152 L30 164 L18 146 Z" },
  { id: "noord-brabant", d: "M62 148 L112 146 L118 176 L58 180 L48 162 Z" },
  { id: "limburg", d: "M118 150 L148 148 L152 196 L128 200 L114 172 Z" },
];

export function NetherlandsMap({
  highlight,
  onPick,
  selected,
  revealName = false,
}: {
  highlight?: string;
  onPick?: (id: string) => void;
  selected?: string | null;
  revealName?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <svg viewBox="0 0 190 210" className="w-full">
        {MAP.map((p) => {
          const on = p.id === highlight || p.id === selected;
          return (
            <path
              key={p.id}
              d={p.d}
              fill={on ? "var(--color-primary)" : "var(--color-primary-soft)"}
              stroke="var(--color-bg)"
              strokeWidth="2"
              className={onPick ? "cursor-pointer" : undefined}
              onClick={() => onPick?.(p.id)}
            />
          );
        })}
      </svg>
      {revealName && highlight ? (
        <p className="mt-2 text-center text-sm text-muted">
          {PROVINCE_LIST.find((p) => p.id === highlight)?.name}
        </p>
      ) : null}
    </div>
  );
}

function DotRow({ count }: { count: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="size-6 rounded-full bg-primary sm:size-7" />
      ))}
    </div>
  );
}

function FiveFrame({ count }: { count: number }) {
  const rows = [];
  for (let i = 0; i < count; i += 5) {
    rows.push(Math.min(5, count - i));
  }
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden>
      {rows.map((n, r) => (
        <DotRow key={r} count={n} />
      ))}
    </div>
  );
}

function Parts({ parts }: { parts: number[] }) {
  return (
    <div className="mx-auto flex max-w-xs items-center justify-center gap-4 py-4" aria-hidden>
      {parts.map((n, i) => (
        <div key={i} className="rounded-md bg-primary-soft p-2">
          <FiveFrame count={n} />
        </div>
      ))}
    </div>
  );
}

function Groups({ groups, size }: { groups: number; size: number }) {
  const g = Math.min(groups, 8);
  const s = Math.min(size, 8);
  return (
    <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-3 py-4" aria-hidden>
      {Array.from({ length: g }, (_, i) => (
        <div key={i} className="flex max-w-20 flex-wrap gap-1 rounded-md bg-primary-soft p-2">
          {Array.from({ length: s }, (_, j) => (
            <span key={j} className="size-2.5 rounded-full bg-primary" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function GameVisual({
  visual,
  reveal = false,
  scaffold = false,
}: {
  visual?: Visual;
  reveal?: boolean;
  scaffold?: boolean;
}) {
  if (!visual) return null;
  if (visual.type === "dots") {
    return (
      <div className="py-4">
        <FiveFrame count={visual.count} />
      </div>
    );
  }
  if (visual.type === "parts") {
    return <Parts parts={visual.parts} />;
  }
  if (visual.type === "groups") {
    return <Groups groups={visual.groups} size={visual.size} />;
  }
  if (visual.type === "letter") {
    return (
      <div className="py-4 text-center">
        <p className="font-display text-6xl font-medium leading-none">{visual.letter}</p>
        {reveal && visual.word ? (
          <p className="mt-3 text-sm text-muted">
            <span className="font-medium text-primary">{visual.word.slice(0, 1).toUpperCase()}</span>
            {visual.word.slice(1)}
          </p>
        ) : null}
      </div>
    );
  }
  if (visual.type === "clock") {
    return (
      <div className="py-2">
        <AnalogClock hours={visual.hours} minutes={visual.minutes} glow={reveal || scaffold} />
      </div>
    );
  }
  if (visual.type === "shapes") {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        {visual.items.map((item, i) => (
          <Shape key={i} item={item} />
        ))}
        <span
          className={cn(
            "grid size-11 place-items-center rounded-md border border-dashed border-border-strong text-lg text-muted",
            !reveal && "lumi-pulse",
          )}
        >
          ?
        </span>
      </div>
    );
  }
  if (visual.type === "map") {
    return <NetherlandsMap highlight={visual.highlight} revealName={reveal} />;
  }
  return null;
}

export function MemoryBoard({
  size,
  active,
  lit,
  disabled,
  onPad,
}: {
  size: number;
  active: number | null;
  lit: number[];
  disabled: boolean;
  onPad: (i: number) => void;
}) {
  const cols = size === 9 ? 3 : 2;
  return (
    <div
      className="mx-auto grid max-w-xs gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: size }, (_, i) => {
        const on = active === i || lit.includes(i);
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onPad(i)}
            className={cn(
              "aspect-square rounded-lg transition-[transform,background-color] duration-150",
              on ? "scale-[0.98] bg-primary" : "bg-primary-soft",
              !disabled && "hover:bg-primary/40",
            )}
            aria-label={`vak ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
