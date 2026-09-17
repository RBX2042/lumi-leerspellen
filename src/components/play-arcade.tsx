import { useEffect, useRef, useState } from "react";
import { playTap } from "@/lib/lumi/audio";
import type { Question } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

export function CatchBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "catch" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const done = useRef(false);
  const [gone, setGone] = useState<number[]>([]);
  const [boom, setBoom] = useState<number | null>(null);
  useEffect(() => {
    done.current = false;
    setGone([]);
    setBoom(null);
    const t = window.setTimeout(() => {
      if (done.current || locked) return;
      done.current = true;
      onSolve(false, "gemist");
    }, q.seconds * 1000 + 80);
    return () => window.clearTimeout(t);
  }, [q.target, q.fallers.join(","), q.seconds, locked, onSolve]);

  const tap = (n: number, i: number) => {
    if (locked || done.current || gone.includes(i)) return;
    playTap();
    setBoom(i);
    done.current = true;
    setGone((g) => [...g, i]);
    window.setTimeout(() => onSolve(n === q.target, String(n)), 160);
  };

  return (
    <div className="relative mx-auto mt-4 h-72 w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-ink/[0.06] shadow-[var(--shadow-card)]">
      <div className="lumi-drain pointer-events-none absolute inset-x-0 top-0 h-1 origin-left bg-primary" style={{ animationDuration: `${q.seconds}s` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
      {q.fallers.map((n, i) => {
        const left = 8 + ((i * 17 + n * 9) % 72);
        const delay = (i * 0.18) % 0.7;
        const dur = q.seconds * (0.82 + (i % 3) * 0.08);
        const hide = gone.includes(i);
        return (
          <button
            key={`${n}-${i}`}
            type="button"
            disabled={locked || hide}
            onClick={() => tap(n, i)}
            className={cn(
              "lumi-faller lumi-press absolute grid size-14 place-items-center rounded-full font-display text-xl shadow-[var(--shadow-lift)]",
              hide && "lumi-pop-out",
              boom === i && n === q.target && "bg-ok text-primary-fg",
              boom === i && n !== q.target && "bg-danger text-primary-fg",
              boom !== i && "bg-primary text-primary-fg",
            )}
            style={{ left: `${left}%`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
            aria-label={String(n)}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function FloatBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "float" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const done = useRef(false);
  const [gone, setGone] = useState<number[]>([]);
  const [boom, setBoom] = useState<number | null>(null);
  useEffect(() => {
    done.current = false;
    setGone([]);
    setBoom(null);
    const t = window.setTimeout(() => {
      if (done.current || locked) return;
      done.current = true;
      onSolve(false, "gemist");
    }, q.seconds * 1000 + 80);
    return () => window.clearTimeout(t);
  }, [q.target, q.floaters.join(","), q.seconds, locked, onSolve]);

  const tap = (label: string, i: number) => {
    if (locked || done.current || gone.includes(i)) return;
    playTap();
    setBoom(i);
    done.current = true;
    setGone((g) => [...g, i]);
    window.setTimeout(() => onSolve(label === q.target, label), 180);
  };

  return (
    <div className="relative mx-auto mt-4 h-80 w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-primary/10 to-ink/[0.04] shadow-[var(--shadow-card)]">
      <div className="lumi-drain pointer-events-none absolute inset-x-0 top-0 h-1 origin-left bg-clay" style={{ animationDuration: `${q.seconds}s` }} />
      {q.floaters.map((label, i) => {
        const left = 6 + ((i * 19 + label.length * 11) % 74);
        const delay = (i * 0.22) % 0.8;
        const dur = q.seconds * (0.88 + (i % 3) * 0.06);
        const hide = gone.includes(i);
        const wx = ((i * 13) % 21) - 10;
        return (
          <button
            key={`${label}-${i}`}
            type="button"
            disabled={locked || hide}
            onClick={() => tap(label, i)}
            className={cn(
              "lumi-rise-float lumi-press absolute flex flex-col items-center",
              hide && "lumi-pop-out",
            )}
            style={{
              left: `${left}%`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              ["--wx" as string]: `${wx}px`,
            }}
            aria-label={label}
          >
            <span
              className={cn(
                "grid size-16 place-items-center rounded-full font-display text-xl shadow-[var(--shadow-lift)]",
                boom === i && label === q.target && "bg-ok text-primary-fg",
                boom === i && label !== q.target && "bg-danger text-primary-fg",
                boom !== i && "bg-primary text-primary-fg",
              )}
            >
              {label}
            </span>
            <span className="mt-0.5 h-8 w-px bg-ink/25" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

export function DashBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "dash" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const done = useRef(false);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    done.current = false;
    setPicked(null);
    const t = window.setTimeout(() => {
      if (done.current || locked) return;
      done.current = true;
      onSolve(false, "te laat");
    }, q.seconds * 1000 + 40);
    return () => window.clearTimeout(t);
  }, [q.goal, q.chips.map((c) => c.label).join(","), q.seconds, locked, onSolve]);

  const tap = (i: number) => {
    if (locked || done.current) return;
    playTap();
    done.current = true;
    setPicked(i);
    const chip = q.chips[i]!;
    window.setTimeout(() => onSolve(chip.ok, chip.label), 180);
  };

  return (
    <div className="relative mx-auto mt-4 h-72 w-full max-w-sm overflow-hidden rounded-[1.8rem] bg-surface shadow-[var(--shadow-card)]">
      <div className="lumi-drain absolute inset-x-0 top-0 h-1.5 origin-left bg-primary" style={{ animationDuration: `${q.seconds}s` }} />
      <p className="pointer-events-none absolute inset-x-0 top-8 text-center font-display text-3xl text-ink/15">{q.goal}</p>
      {q.chips.map((chip, i) => {
        const left = 8 + ((i * 23 + chip.label.length * 7) % 70);
        const top = 18 + ((i * 17 + 11) % 52);
        const wx = 10 + (i % 4) * 8;
        const wy = 8 + (i % 3) * 6;
        return (
          <button
            key={`${chip.label}-${i}`}
            type="button"
            disabled={locked}
            onClick={() => tap(i)}
            className={cn(
              "lumi-wander lumi-press absolute grid size-14 place-items-center rounded-2xl font-display text-xl shadow-[var(--shadow-lift)]",
              picked === i && chip.ok && "bg-ok text-primary-fg",
              picked === i && !chip.ok && "bg-danger text-primary-fg",
              picked !== i && "bg-primary text-primary-fg",
            )}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${2.4 + (i % 3) * 0.5}s`,
              animationDelay: `${i * 0.08}s`,
              ["--wx" as string]: `${wx}px`,
              ["--wy" as string]: `${wy}px`,
            }}
            aria-label={chip.label}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
