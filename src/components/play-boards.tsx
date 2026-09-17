import { useEffect, useRef, useState, type PointerEvent } from "react";
import { LumiMark } from "@/components/lumi-mark";
import { Button } from "@/components/ui/button";
import { answerLabel, centsLabel, formatSpoken, isPlayBoard } from "@/lib/lumi/interact";
import { playTap } from "@/lib/lumi/audio";
import type { Question } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

export { isPlayBoard, answerLabel };

export function PlayBoard({
  q,
  locked,
  onSolve,
}: {
  q: Question;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  if (q.kind === "pairtap") return <PairTapBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "tap") return <TapBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "line") return <LineBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "tiles") return <TilesBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "sort") return <SortBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "coins") return <CoinsBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "flip") return <FlipBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "clockset") return <ClockBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "grid") return <GridBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "pie") return <PieBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "beads") return <BeadsBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "order") return <OrderBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "path") return <PathBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "balance") return <BalanceBoard q={q} locked={locked} onSolve={onSolve} />;
  if (q.kind === "mirror") return <MirrorBoard q={q} locked={locked} onSolve={onSolve} />;
  return null;
}

function TapBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "tap" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const done = useRef(false);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    done.current = false;
    setPicked(null);
  }, [q.prompt, q.answer]);
  return (
    <div className="lumi-tiles mx-auto mt-6 grid w-full max-w-sm grid-cols-3 gap-3">
      {q.options.map((o) => (
        <button
          key={o}
          type="button"
          disabled={locked}
          onClick={() => {
            if (locked || done.current) return;
            playTap();
            done.current = true;
            setPicked(o);
            window.setTimeout(() => onSolve(o === q.answer, o), 180);
          }}
          className={cn(
            "lumi-block min-h-14 break-words rounded-2xl px-2 py-3 text-center font-display text-xl leading-tight sm:min-h-20 sm:text-2xl",
            picked === o
              ? o === q.answer
                ? "bg-ok text-primary-fg"
                : "bg-danger text-primary-fg"
              : "bg-surface text-ink hover:bg-surface-2",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function PairTapBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "pairtap" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [sel, setSel] = useState<number[]>([]);
  const done = useRef(false);
  useEffect(() => {
    setSel([]);
    done.current = false;
  }, [q.numbers.join(","), q.target]);
  const toggle = (i: number) => {
    if (locked || done.current) return;
    playTap();
    const next = sel.includes(i) ? sel.filter((x) => x !== i) : sel.length >= 2 ? [i] : [...sel, i];
    setSel(next);
    if (next.length === 2) {
      done.current = true;
      const sum = q.numbers[next[0]!]! + q.numbers[next[1]!]!;
      onSolve(sum === q.target, `${q.numbers[next[0]!]} + ${q.numbers[next[1]!]}`);
    }
  };
  return (
    <div className="lumi-tiles mx-auto mt-6 grid w-full max-w-sm grid-cols-3 gap-3">
      {q.numbers.map((n, i) => (
        <button
          key={`${n}-${i}`}
          type="button"
          disabled={locked}
          onClick={() => toggle(i)}
          className={cn(
            "min-h-20 rounded-2xl font-display text-2xl shadow-[var(--shadow-card)] transition-transform duration-150 active:scale-[0.96]",
            sel.includes(i) ? "bg-primary text-primary-fg" : "bg-surface text-ink hover:bg-surface-2",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function LineBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "line" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const ticks = [];
  for (let n = q.min; n <= q.max; n += q.step) ticks.push(n);
  const start = q.from ?? q.min;
  const [at, setAt] = useState(start);
  const atRef = useRef(start);
  const done = useRef(false);
  const drag = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setAt(q.from ?? q.min);
    atRef.current = q.from ?? q.min;
    done.current = false;
    drag.current = false;
  }, [q.answer, q.from, q.min]);
  const snap = (clientX: number) => {
    const el = track.current;
    if (!el) return atRef.current;
    const r = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const raw = q.min + t * (q.max - q.min);
    const n = Math.round(raw / q.step) * q.step;
    return Math.min(q.max, Math.max(q.min, n));
  };
  const pickTick = (n: number) => {
    if (locked || done.current) return;
    playTap();
    atRef.current = n;
    setAt(n);
    done.current = true;
    window.setTimeout(() => onSolve(n === q.answer, String(n)), 280);
  };
  const onPtr = (e: PointerEvent<HTMLDivElement>) => {
    if (locked || done.current) return;
    drag.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const n = snap(e.clientX);
    atRef.current = n;
    setAt(n);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || locked || done.current) return;
    const n = snap(e.clientX);
    atRef.current = n;
    setAt(n);
  };
  const onUp = () => {
    if (!drag.current || locked || done.current) return;
    drag.current = false;
    playTap();
    const n = atRef.current;
    done.current = true;
    window.setTimeout(() => onSolve(n === q.answer, String(n)), 220);
  };
  const pct = (n: number) => ((n - q.min) / (q.max - q.min)) * 100;
  return (
    <div className="mt-8 px-1 sm:px-3">
      <div
        ref={track}
        className="relative mx-auto h-16 min-w-0 max-w-lg touch-none select-none"
        onPointerDown={onPtr}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="absolute top-7 right-0 left-0 h-1.5 rounded-full bg-ink/80" />
        {ticks.map((n) => (
          <button
            key={n}
            type="button"
            disabled={locked}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              pickTick(n);
            }}
            className="absolute top-0 flex h-16 w-8 -translate-x-1/2 flex-col items-center justify-between sm:w-7"
            style={{ left: `${pct(n)}%` }}
            aria-label={String(n)}
          >
            <span
              className={cn(
                "block w-0.5 bg-ink",
                n % (q.step * 5) === 0 || n === q.min || n === q.max ? "h-4" : "h-2.5",
              )}
            />
            {(n === q.min || n === q.max || n % (q.step * 5) === 0 || ticks.length < 13) && (
              <span className="text-[10px] tabular-nums text-muted">{n}</span>
            )}
          </button>
        ))}
        <span
          className="pointer-events-none absolute top-2 size-8 -translate-x-1/2 rounded-full bg-primary shadow-[var(--shadow-lift)] transition-[left] duration-150"
          style={{ left: `${pct(at)}%`, transform: "translateX(-50%) translateZ(12px)" }}
          aria-hidden
        />
      </div>
      <p className="mt-3 text-center text-sm text-muted">Sleep of tik · nu op {at}</p>
    </div>
  );
}

function TilesBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "tiles" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(q.word.length).fill(null));
  const [used, setUsed] = useState<boolean[]>(() => q.tiles.map(() => false));
  const done = useRef(false);
  useEffect(() => {
    setSlots(Array(q.word.length).fill(null));
    setUsed(q.tiles.map(() => false));
    done.current = false;
  }, [q.word, q.tiles]);

  const place = (tileIndex: number) => {
    if (locked || done.current || used[tileIndex]) return;
    const empty = slots.findIndex((s) => s == null);
    if (empty < 0) return;
    playTap();
    const next = [...slots];
    next[empty] = tileIndex;
    const nextUsed = [...used];
    nextUsed[tileIndex] = true;
    setSlots(next);
    setUsed(nextUsed);
    if (next.every((s) => s != null)) {
      const built = next.map((i) => q.tiles[i!]!).join("");
      done.current = true;
      window.setTimeout(() => onSolve(built === q.word, built), 200);
    }
  };
  const pop = (slotIndex: number) => {
    if (locked || done.current || slots[slotIndex] == null) return;
    const tileIndex = slots[slotIndex]!;
    playTap();
    const next = [...slots];
    next[slotIndex] = null;
    setSlots(next);
    const nextUsed = [...used];
    nextUsed[tileIndex] = false;
    setUsed(nextUsed);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap justify-center gap-1.5">
        {slots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pop(i)}
            className={cn(
              "grid place-items-center rounded-md bg-surface font-display shadow-[var(--shadow-card)]",
              q.word.length >= 8 ? "lumi-block size-10 text-lg sm:size-11" : "lumi-block size-11 text-xl sm:size-12",
            )}
            aria-label={s != null ? `letter ${q.tiles[s]}, terug` : `plek ${i + 1}`}
          >
            {s != null ? q.tiles[s] : ""}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {q.tiles.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            disabled={locked || used[i]}
            onClick={() => place(i)}
            className={cn(
              "grid place-items-center rounded-2xl font-display shadow-[var(--shadow-card)]",
              q.word.length >= 8 ? "size-11 text-lg" : "size-12 text-xl",
              used[i] ? "bg-surface-2 text-faint" : "bg-primary text-primary-fg active:scale-[0.96]",
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function SortBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "sort" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [left, setLeft] = useState<string[]>([]);
  const [right, setRight] = useState<string[]>([]);
  const [hold, setHold] = useState<string | null>(null);
  const done = useRef(false);
  useEffect(() => {
    setLeft([]);
    setRight([]);
    setHold(null);
    done.current = false;
  }, [q.prompt, q.items.map((i) => i.id).join()]);

  const placed = new Set([...left, ...right]);
  const rest = q.items.filter((it) => !placed.has(it.id));

  const drop = (bucket: "left" | "right", id?: string) => {
    if (locked || done.current) return;
    const itemId = id ?? hold;
    if (!itemId) return;
    playTap();
    const nextL = left.filter((x) => x !== itemId);
    const nextR = right.filter((x) => x !== itemId);
    if (bucket === "left") nextL.push(itemId);
    else nextR.push(itemId);
    setLeft(nextL);
    setRight(nextR);
    setHold(null);
    if (nextL.length + nextR.length === q.items.length) {
      done.current = true;
      const ok = q.items.every((it) => {
        const inL = nextL.includes(it.id);
        return it.bucket === q.left.key ? inL : !inL;
      });
      onSolve(ok, ok ? "goed gesorteerd" : "niet goed");
    }
  };

  const lift = (id: string) => {
    if (locked || done.current) return;
    playTap();
    setLeft((l) => l.filter((x) => x !== id));
    setRight((r) => r.filter((x) => x !== id));
    setHold(id);
  };

  const Bucket = ({
    side,
    label,
    ids,
  }: {
    side: "left" | "right";
    label: string;
    ids: string[];
  }) => (
    <div
      role="group"
      aria-label={label}
      className="min-h-32 rounded-2xl bg-surface p-3 text-left shadow-[var(--shadow-card)]"
      onClick={() => drop(side)}
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const it = q.items.find((x) => x.id === id);
          return (
            <span key={id} className="rounded-md bg-primary-soft">
              <button
                type="button"
                disabled={locked}
                onClick={(e) => {
                  e.stopPropagation();
                  lift(id);
                }}
                className="px-2 py-1 text-sm"
                aria-label={`${it?.label ?? ""}, terug`}
              >
                {it?.label}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        <Bucket side="left" label={q.left.label} ids={left} />
        <Bucket side="right" label={q.right.label} ids={right} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {rest.map((it) => (
          <button
            key={it.id}
            type="button"
            disabled={locked}
            onClick={() => {
              playTap();
              setHold(it.id);
            }}
            className={cn(
              "min-h-11 rounded-2xl bg-surface px-3 py-2 text-sm font-medium shadow-[var(--shadow-card)]",
              hold === it.id && "bg-primary text-primary-fg",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      {hold ? <p className="mt-2 text-center text-xs text-muted">Tik een bak</p> : null}
    </div>
  );
}

function CoinsBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "coins" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [stack, setStack] = useState<number[]>([]);
  const done = useRef(false);
  useEffect(() => {
    setStack([]);
    done.current = false;
  }, [q.target]);
  const total = stack.reduce((a, b) => a + b, 0);
  const over = total > q.target;
  const add = (c: number) => {
    if (locked || done.current) return;
    playTap();
    const next = [...stack, c];
    const sum = next.reduce((a, b) => a + b, 0);
    setStack(next);
    if (sum === q.target) {
      done.current = true;
      onSolve(true, centsLabel(sum));
    }
  };
  const undo = () => {
    if (locked || stack.length === 0) return;
    playTap();
    setStack(stack.slice(0, -1));
  };
  return (
    <div className="mt-6">
      <p className={cn("text-center font-display text-3xl tabular-nums", over && "text-clay")}>{centsLabel(total)}</p>
      <p className="mt-1 text-center text-xs text-muted">van {centsLabel(q.target)}</p>
      <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-3">
        {q.denominations.map((c) => (
          <button
            key={c}
            type="button"
            disabled={locked}
            onClick={() => add(c)}
            className="grid aspect-square place-items-center rounded-full bg-primary text-primary-fg shadow-[var(--shadow-card)] active:scale-[0.96]"
          >
            <span className="font-display text-sm">{centsLabel(c)}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Button type="button" variant="secondary" size="sm" disabled={locked || stack.length === 0} onClick={undo}>
          Terug
        </Button>
      </div>
    </div>
  );
}

function FlipBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "flip" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const misses = useRef(0);
  useEffect(() => {
    setOpen([]);
    setMatched([]);
    setBusy(false);
    misses.current = 0;
  }, [q.cards.map((c) => c.id).join()]);

  const flip = (id: string) => {
    if (locked || busy || matched.includes(id) || open.includes(id)) return;
    playTap();
    const next = [...open, id];
    setOpen(next);
    if (next.length < 2) return;
    const a = q.cards.find((c) => c.id === next[0]);
    const b = q.cards.find((c) => c.id === next[1]);
    if (a && b && a.pair === b.pair) {
      const now = [...matched, a.id, b.id];
      setMatched(now);
      setOpen([]);
      if (now.length >= q.cards.length) {
        onSolve(misses.current <= 1, misses.current === 0 ? "zonder misser" : "met een misser");
      }
      return;
    }
    misses.current += 1;
    setBusy(true);
    window.setTimeout(() => {
      setOpen([]);
      setBusy(false);
    }, 700);
  };

  const cols = q.cards.length > 4 ? "1fr 1fr 1fr" : "1fr 1fr";
  return (
    <div
      className="lumi-tiles mx-auto mt-6 grid max-w-sm gap-3"
      style={{ gridTemplateColumns: cols }}
    >
      {q.cards.map((c) => {
        const up = open.includes(c.id) || matched.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            disabled={locked}
            onClick={() => flip(c.id)}
            className={cn(
              "grid min-h-20 place-items-center rounded-2xl shadow-[var(--shadow-card)] transition-[transform,background-color] duration-150",
              up ? "bg-surface text-ink" : "bg-primary text-primary-fg",
              matched.includes(c.id) && "bg-ok text-primary-fg",
            )}
          >
            {up ? (
              <span className="px-2 font-display text-lg">{c.face}</span>
            ) : (
              <LumiMark className="size-7" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ClockBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "clockset" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<"h" | "m" | null>(null);
  useEffect(() => {
    setHours(12);
    setMinutes(0);
  }, [q.hours, q.minutes]);

  const setFromPoint = (clientX: number, clientY: number, which: "h" | "m") => {
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let deg = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;
    if (which === "m") {
      const m = Math.round(deg / 6 / 5) * 5;
      setMinutes(m === 60 ? 0 : m);
    } else {
      const h = Math.round(deg / 30);
      setHours(h === 0 ? 12 : h);
    }
  };

  const onPtr = (e: PointerEvent<SVGSVGElement>) => {
    if (locked) return;
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    drag.current = dist > r.width * 0.22 ? "m" : "h";
    el.setPointerCapture(e.pointerId);
    setFromPoint(e.clientX, e.clientY, drag.current);
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || locked) return;
    setFromPoint(e.clientX, e.clientY, drag.current);
  };
  const onUp = () => {
    drag.current = null;
  };

  const hDeg = ((hours % 12) + minutes / 60) * 30;
  const mDeg = minutes * 6;
  const spoken = formatSpoken(hours, minutes);

  return (
    <div className="mt-4">
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="mx-auto size-[min(18rem,80vw)] max-w-full touch-none drop-shadow-[0_18px_28px_color-mix(in_oklab,var(--color-ink)_22%,transparent)]"
        onPointerDown={onPtr}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <circle cx="100" cy="100" r="94" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const a = (n / 12) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(a) * 70;
          const y = 100 + Math.sin(a) * 70;
          return (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="var(--color-ink)"
            >
              {n}
            </text>
          );
        })}
        <line
          x1="100"
          y1="100"
          x2={100 + Math.sin((hDeg * Math.PI) / 180) * 44}
          y2={100 - Math.cos((hDeg * Math.PI) / 180) * 44}
          stroke="var(--color-ink)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2={100 + Math.sin((mDeg * Math.PI) / 180) * 62}
          y2={100 - Math.cos((mDeg * Math.PI) / 180) * 62}
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="var(--color-primary)" />
      </svg>
      <p className="mt-2 text-center text-sm text-muted">{spoken}</p>
      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          disabled={locked}
          onClick={() => {
            playTap();
            const ok = hours % 12 === q.hours % 12 && minutes === q.minutes;
            onSolve(ok, spoken);
          }}
        >
          Klaar
        </Button>
      </div>
    </div>
  );
}

function GridBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "grid" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const done = useRef(false);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    done.current = false;
    setPicked(null);
  }, [q.answer, q.cells.join(",")]);
  const tap = (n: number) => {
    if (locked || done.current) return;
    playTap();
    setPicked(n);
    done.current = true;
    window.setTimeout(() => onSolve(n === q.answer, String(n)), 220);
  };
  const compact = q.cols >= 8;
  return (
    <div className="-mx-1 mt-6 overflow-x-auto pb-1 sm:mx-0">
    <div
      className={cn("lumi-tiles mx-auto grid w-full max-w-lg", compact ? "min-w-[22rem] gap-0.5 sm:min-w-0 sm:gap-1" : "gap-1.5 sm:gap-2")}
      style={{ gridTemplateColumns: `repeat(${q.cols}, minmax(0, 1fr))` }}
    >
      {q.cells.map((n) => (
        <button
          key={n}
          type="button"
          disabled={locked}
          onClick={() => tap(n)}
          className={cn(
            "grid w-full place-items-center rounded-md font-display tabular-nums shadow-[var(--shadow-card)] transition-transform duration-150 active:scale-[0.96]",
            compact
              ? "aspect-square min-h-0 text-[11px] sm:min-h-11 sm:text-sm"
              : "min-h-12 text-lg sm:min-h-14",
            picked === n
              ? n === q.answer
                ? "bg-ok text-primary-fg"
                : "bg-danger text-primary-fg"
              : "bg-surface text-ink hover:bg-surface-2",
          )}
        >
          {n}
        </button>
      ))}
    </div>
    </div>
  );
}

function pieSlice(i: number, n: number, r = 78, cx = 100, cy = 100): string {
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
  const x0 = cx + Math.cos(a0) * r;
  const y0 = cy + Math.sin(a0) * r;
  const x1 = cx + Math.cos(a1) * r;
  const y1 = cy + Math.sin(a1) * r;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

function PieBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "pie" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [on, setOn] = useState<boolean[]>(() => Array(q.slices).fill(false));
  const onRef = useRef(on);
  const done = useRef(false);
  useEffect(() => {
    const next = Array(q.slices).fill(false);
    setOn(next);
    onRef.current = next;
    done.current = false;
  }, [q.slices, q.need]);
  const filled = on.filter(Boolean).length;
  const toggle = (i: number) => {
    if (locked || done.current) return;
    playTap();
    setOn((prev) => {
      const next = prev.map((v, k) => (k === i ? !v : v));
      onRef.current = next;
      return next;
    });
  };
  const submit = () => {
    if (locked || done.current) return;
    playTap();
    done.current = true;
    const n = onRef.current.filter(Boolean).length;
    onSolve(n === q.need, `${n}/${q.slices}`);
  };
  return (
    <div className="mt-4">
      <svg viewBox="0 0 200 200" className="mx-auto size-56 max-w-full">
        {on.map((lit, i) => (
          <path
            key={i}
            d={pieSlice(i, q.slices)}
            fill={lit ? "var(--color-primary)" : "var(--color-surface)"}
            stroke="var(--color-ink)"
            strokeWidth="2"
            role="button"
            tabIndex={locked ? -1 : 0}
            aria-pressed={lit}
            aria-label={`stuk ${i + 1} van ${q.slices}${lit ? ", aan" : ""}`}
            className={locked ? undefined : "cursor-pointer"}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(i);
              }
            }}
          />
        ))}
        <circle cx="100" cy="100" r="10" fill="var(--color-bg)" stroke="var(--color-ink)" strokeWidth="2" />
      </svg>
      <p className="mt-2 text-center font-display text-xl tabular-nums">
        {filled}/{q.slices}
      </p>
      <div className="mt-4 flex justify-center">
        <Button type="button" disabled={locked} onClick={submit}>
          Klaar
        </Button>
      </div>
    </div>
  );
}

function BeadRow({
  count,
  locked,
  onSet,
}: {
  count: number;
  locked: boolean;
  onSet: (n: number) => void;
}) {
  return (
    <div className="flex w-full min-w-0 items-center gap-0.5 sm:gap-1">
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1;
        const lit = n <= count;
        const red = i < 5;
        return (
          <button
            key={i}
            type="button"
            disabled={locked}
            onClick={() => onSet(count === n ? n - 1 : n)}
            aria-label={n === 1 ? "1 kraal" : `${n} kralen`}
            className={cn(
              "aspect-square min-h-10 min-w-0 flex-1 rounded-full transition-transform duration-150 active:scale-[0.94] sm:max-w-10 md:max-w-11",
              lit
                ? red
                  ? "bg-primary shadow-[var(--shadow-card)]"
                  : "bg-ink shadow-[var(--shadow-card)]"
                : "bg-bg ring-1 ring-ink/25",
            )}
          />
        );
      })}
    </div>
  );
}

function BeadsBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "beads" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [top, setTop] = useState(0);
  const [bot, setBot] = useState(0);
  const topRef = useRef(0);
  const botRef = useRef(0);
  const done = useRef(false);
  useEffect(() => {
    setTop(0);
    setBot(0);
    topRef.current = 0;
    botRef.current = 0;
    done.current = false;
  }, [q.target, q.rows]);
  const total = top + (q.rows === 2 ? bot : 0);
  const submit = () => {
    if (locked || done.current) return;
    playTap();
    done.current = true;
    const n = topRef.current + (q.rows === 2 ? botRef.current : 0);
    onSolve(n === q.target, String(n));
  };
  return (
    <div className="mt-6">
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-surface px-2 py-4 shadow-[var(--shadow-card)] sm:px-3">
        <BeadRow
          count={top}
          locked={locked}
          onSet={(n) => {
            playTap();
            topRef.current = n;
            setTop(n);
          }}
        />
        {q.rows === 2 ? (
          <div className="mt-3">
            <BeadRow
              count={bot}
              locked={locked}
              onSet={(n) => {
                playTap();
                botRef.current = n;
                setBot(n);
              }}
            />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-center font-display text-2xl tabular-nums">{total}</p>
      <div className="mt-4 flex justify-center">
        <Button type="button" disabled={locked} onClick={submit}>
          Klaar
        </Button>
      </div>
    </div>
  );
}

function OrderBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "order" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [slots, setSlots] = useState<(string | null)[]>(() => Array(q.answer.length).fill(null));
  const done = useRef(false);
  useEffect(() => {
    setSlots(Array(q.answer.length).fill(null));
    done.current = false;
  }, [q.answer.join(), q.items.map((i) => i.id).join()]);
  const used = new Set(slots.filter(Boolean) as string[]);
  const rest = q.items.filter((it) => !used.has(it.id));
  const labelOf = (id: string) => q.items.find((it) => it.id === id)?.label ?? id;
  const place = (id: string) => {
    if (locked || done.current) return;
    const empty = slots.findIndex((s) => s == null);
    if (empty < 0) return;
    playTap();
    const next = [...slots];
    next[empty] = id;
    setSlots(next);
    if (next.every((s) => s != null)) {
      const ok = next.every((s, i) => s === q.answer[i]);
      done.current = true;
      window.setTimeout(() => onSolve(ok, next.map((s) => labelOf(s!)).join(" ")), 200);
    }
  };
  const pop = (i: number) => {
    if (locked || done.current || slots[i] == null) return;
    playTap();
    const next = [...slots];
    next[i] = null;
    setSlots(next);
  };
  const long = q.items.some((it) => it.label.length > 3);
  return (
    <div className="mt-6">
      <div className="flex flex-wrap justify-center gap-1.5">
        {slots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => pop(i)}
            className={cn(
              "min-h-11 rounded-md bg-surface px-3 font-medium shadow-[var(--shadow-card)]",
              long ? "min-w-16" : "min-w-11 font-display text-lg",
            )}
            aria-label={s ? `${labelOf(s)}, terug` : `plek ${i + 1}`}
          >
            {s ? labelOf(s) : i + 1}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {rest.map((it) => (
          <button
            key={it.id}
            type="button"
            disabled={locked}
            onClick={() => place(it.id)}
            className="min-h-12 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-fg shadow-[var(--shadow-card)] active:scale-[0.96]"
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PathBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "path" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [path, setPath] = useState<number[]>([]);
  const done = useRef(false);
  useEffect(() => {
    setPath([]);
    done.current = false;
  }, [q.word, q.letters.join("")]);
  const adj = (a: number, b: number) => {
    const ra = Math.floor(a / q.cols);
    const ca = a % q.cols;
    const rb = Math.floor(b / q.cols);
    const cb = b % q.cols;
    return Math.abs(ra - rb) + Math.abs(ca - cb) === 1;
  };
  const tap = (i: number) => {
    if (locked || done.current) return;
    playTap();
    if (path.includes(i)) {
      setPath(path.slice(0, path.indexOf(i) + 1));
      return;
    }
    const last = path[path.length - 1];
    const next = last == null || !adj(last, i) ? [i] : [...path, i];
    setPath(next);
    const built = next.map((k) => q.letters[k]).join("");
    if (built.length >= q.word.length) {
      done.current = true;
      window.setTimeout(() => onSolve(built === q.word, built), 180);
    }
  };
  return (
    <div className="mt-6">
      <div
        className="lumi-tiles mx-auto grid w-full max-w-sm gap-1.5 sm:max-w-md sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${q.cols}, minmax(0, 1fr))` }}
      >
        {q.letters.map((ch, i) => {
          const on = path.includes(i);
          const step = path.indexOf(i);
          return (
            <button
              key={`${ch}-${i}`}
              type="button"
              disabled={locked}
              onClick={() => tap(i)}
              className={cn(
                "grid aspect-square place-items-center rounded-2xl font-display text-xl shadow-[var(--shadow-card)] active:scale-[0.96]",
                on ? "bg-primary text-primary-fg" : "bg-surface text-ink",
              )}
            >
              <span className="leading-none">{ch}</span>
              {on ? <span className="sr-only">stap {step + 1}</span> : null}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center font-display text-lg tracking-[0.18em]">
        {path.map((i) => q.letters[i]).join("") || "·"}
      </p>
    </div>
  );
}

function BalanceBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "balance" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const [stack, setStack] = useState<number[]>([]);
  const stackRef = useRef<number[]>([]);
  const done = useRef(false);
  useEffect(() => {
    setStack([]);
    stackRef.current = [];
    done.current = false;
  }, [q.left, q.weights.join(",")]);
  const right = stack.reduce((a, b) => a + b, 0);
  const tilt = right === q.left ? 0 : right > q.left ? 8 : -8;
  const add = (w: number) => {
    if (locked || done.current) return;
    playTap();
    const next = [...stackRef.current, w];
    stackRef.current = next;
    setStack(next);
  };
  const undo = () => {
    if (locked || done.current || stackRef.current.length === 0) return;
    playTap();
    const next = stackRef.current.slice(0, -1);
    stackRef.current = next;
    setStack(next);
  };
  const submit = () => {
    if (locked || done.current) return;
    playTap();
    done.current = true;
    const n = stackRef.current.reduce((a, b) => a + b, 0);
    onSolve(n === q.left, String(n));
  };
  return (
    <div className="mt-4">
      <svg viewBox="0 0 240 120" className="mx-auto h-28 w-full max-w-sm">
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "120px 88px", transition: "transform 200ms" }}>
          <rect x="20" y="44" width="70" height="36" rx="8" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
          <text x="55" y="67" textAnchor="middle" fontSize="16" fill="var(--color-ink)">
            {q.left}
          </text>
          <rect x="150" y="44" width="70" height="36" rx="8" fill="var(--color-primary-soft)" stroke="var(--color-ink)" strokeWidth="2" />
          <text x="185" y="67" textAnchor="middle" fontSize="16" fill="var(--color-ink)">
            {right || ""}
          </text>
          <line x1="28" y1="88" x2="212" y2="88" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
        </g>
        <polygon points="120,88 112,112 128,112" fill="var(--color-ink)" />
      </svg>
      <div className="mx-auto mt-2 flex max-w-xs flex-wrap justify-center gap-2">
        {q.weights.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            disabled={locked}
            onClick={() => add(w)}
            className="grid size-12 place-items-center rounded-2xl bg-primary font-display text-lg text-primary-fg shadow-[var(--shadow-card)] active:scale-[0.96]"
          >
            {w}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={locked || stack.length === 0} onClick={undo}>
          Terug
        </Button>
        <Button type="button" disabled={locked} onClick={submit}>
          Klaar
        </Button>
      </div>
    </div>
  );
}

function MirrorBoard({
  q,
  locked,
  onSolve,
}: {
  q: Extract<Question, { kind: "mirror" }>;
  locked: boolean;
  onSolve: (ok: boolean, picked?: string) => void;
}) {
  const half = q.cols / 2;
  const given = q.target.map((_, i) => i % q.cols < half);
  const [cells, setCells] = useState<boolean[]>(() => q.target.map((v, i) => (given[i] ? v : false)));
  const cellsRef = useRef(cells);
  const done = useRef(false);
  useEffect(() => {
    const next = q.target.map((v, i) => (i % q.cols < half ? v : false));
    setCells(next);
    cellsRef.current = next;
    done.current = false;
  }, [q.target.join(), q.cols, q.rows, half]);
  const tap = (i: number) => {
    if (locked || done.current || given[i]) return;
    playTap();
    setCells((c) => {
      const next = c.map((v, k) => (k === i ? !v : v));
      cellsRef.current = next;
      return next;
    });
  };
  const submit = () => {
    if (locked || done.current) return;
    playTap();
    done.current = true;
    const ok = cellsRef.current.every((v, i) => v === q.target[i]);
    onSolve(ok, ok ? "spiegelbeeld" : "nog niet");
  };
  return (
    <div className="mt-6">
      <div
        className="relative mx-auto grid max-w-xs gap-1.5"
        style={{ gridTemplateColumns: `repeat(${q.cols}, minmax(0, 1fr))` }}
      >
        {cells.map((on, i) => (
          <button
            key={i}
            type="button"
            disabled={locked || given[i]}
            onClick={() => tap(i)}
            className={cn(
              "aspect-square rounded-md shadow-[var(--shadow-card)]",
              on ? "bg-primary" : "bg-surface",
              given[i] && "opacity-90",
            )}
            aria-label={given[i] ? "vast" : on ? "aan" : "uit"}
          />
        ))}
        <span
          className="pointer-events-none absolute inset-y-0 w-px bg-ink/40"
          style={{ left: "50%" }}
          aria-hidden
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Button type="button" disabled={locked} onClick={submit}>
          Klaar
        </Button>
      </div>
    </div>
  );
}
