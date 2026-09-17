import type { Beat, GroupKey, OrderQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, pick, shuffle } from "../interact-util.ts";

export function rij(group: GroupKey, _level: number, beat: Beat): OrderQuestion {
  const g = groupIndex(group);
  const mode = g <= 1 ? 0 : g <= 3 ? pick([0, 1]) : beat === "warmup" ? 0 : pick([0, 1, 2]);
  if (mode === 0) {
    const count = g <= 2 ? 4 : 5;
    const start = g <= 2 ? between(1, 6) : between(1, 40);
    const step = g <= 4 ? 1 : pick([1, 2, 5]);
    const nums = Array.from({ length: count }, (_, i) => start + i * step);
    const extra = beat === "boss" ? [start + count * step + step] : [];
    const items = shuffle([...nums, ...extra]).map((n, i) => ({ id: `n${i}-${n}`, label: String(n) }));
    const answer = nums.map((n) => items.find((it) => it.label === String(n))!.id);
    return {
      kind: "order",
      prompt: "Zet van klein naar groot",
      setup: "Tik de getallen in de goede volgorde.",
      items,
      answer,
      teach: `Kleinste eerst: ${nums.join(", ")}. Elk volgende is ${step === 1 ? "één meer" : `+${step}`}.`,
      hint: "Wat is het kleinste? Dat mag eerst.",
      tag: nums.join("-"),
    };
  }
  if (mode === 1) {
    const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];
    const start = between(0, 2);
    const slice = days.slice(start, start + 3);
    const items = shuffle(slice).map((d, i) => ({ id: `d${i}`, label: d }));
    const answer = slice.map((d) => items.find((it) => it.label === d)!.id);
    return {
      kind: "order",
      prompt: "Zet de dagen op volgorde",
      items,
      answer,
      teach: `In de week: ${slice.join(", ")}. Maandag is de eerste schooldag.`,
      hint: "Welke dag komt het eerst in de week?",
      tag: slice[0],
    };
  }
  const sizes = [
    ["muis", "kat", "paard"],
    ["munt", "boek", "tafel"],
    ["druppel", "plas", "zee"],
  ];
  const row = pick(sizes);
  const items = shuffle([...row]).map((w, i) => ({ id: `s${i}`, label: w }));
  const answer = row.map((w) => items.find((it) => it.label === w)!.id);
  return {
    kind: "order",
    prompt: "Zet van klein naar groot",
    items,
    answer,
    teach: `${row[0]} is het kleinst, daarna ${row[1]}, dan ${row[2]}.`,
    hint: "Wat is het kleinst? Dat mag eerst.",
    tag: row.join("-"),
  };
}
