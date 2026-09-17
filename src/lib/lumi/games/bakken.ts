import type { Beat, GroupKey, SortQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { pick, shuffle } from "../interact-util.ts";

export function bakken(group: GroupKey, _level: number, beat: Beat): SortQuestion {
  const g = groupIndex(group);
  const mode = g <= 2 ? 0 : g <= 4 ? (beat === "warmup" ? 0 : 1) : pick([1, 2]);
  if (mode === 0) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6);
    return {
      kind: "sort",
      prompt: "Sleep naar even of oneven",
      left: { label: "Even", key: "even" },
      right: { label: "Oneven", key: "odd" },
      items: nums.map((n, i) => ({
        id: `n${i}`,
        label: String(n),
        bucket: n % 2 === 0 ? "even" : "odd",
      })),
      teach: "Even eindigt op 0, 2, 4, 6, 8. Oneven op 1, 3, 5, 7, 9. Kijk naar het laatste cijfer.",
      hint: "Kijk alleen naar het laatste cijfer.",
      tag: "even-oneven",
    };
  }
  if (mode === 1) {
    const ei = ["trein", "geit", "klein", "ei", "plein"];
    const ij = ["tijd", "wijd", "ijs", "dijk", "blij"];
    const mix = shuffle([
      ...ei.slice(0, 3).map((w) => ({ w, bucket: "ei" })),
      ...ij.slice(0, 3).map((w) => ({ w, bucket: "ij" })),
    ]);
    return {
      kind: "sort",
      prompt: "ei of ij?",
      left: { label: "ei", key: "ei" },
      right: { label: "ij", key: "ij" },
      items: mix.map((x, i) => ({ id: `w${i}`, label: x.w, bucket: x.bucket })),
      teach: "Zeg het woord. ei klinkt als in trein, ij als in tijd. Je hoort hetzelfde, je schrijft het verschil.",
      hint: "Zeg het woord. Denk aan een woord dat je al kent: trein of tijd.",
      tag: "ei-ij",
    };
  }
  const low = shuffle([3, 5, 8, 12, 19, 4]).slice(0, 3);
  const high = shuffle([25, 40, 50, 80, 100, 60]).slice(0, 3);
  const mix = shuffle([
    ...low.map((n) => ({ n, bucket: "lt" })),
    ...high.map((n) => ({ n, bucket: "gt" })),
  ]);
  return {
    kind: "sort",
    prompt: "Kleiner of groter dan 20?",
    left: { label: "< 20", key: "lt" },
    right: { label: "> 20", key: "gt" },
    items: mix.map((x, i) => ({ id: `v${i}`, label: String(x.n), bucket: x.bucket })),
    teach: "20 is de grens. Alles eronder in de linker bak, alles erboven rechts.",
    hint: "Vergelijk met 20. Is het minder of meer?",
    tag: "vergelijken",
  };
}
