import type { Beat, GroupKey, MirrorQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, rand } from "../interact-util.ts";

export function spiegel(group: GroupKey, _level: number, beat: Beat): MirrorQuestion {
  const g = groupIndex(group);
  const cols = g <= 2 ? 4 : 6;
  const rows = beat === "warmup" ? 3 : g <= 2 ? 4 : 4;
  const half = cols / 2;
  const target = Array.from({ length: rows * cols }, () => false);
  const fill = beat === "warmup" ? 2 : between(3, Math.min(6, rows * half - 1));
  let placed = 0;
  let guard = 0;
  while (placed < fill && guard < 80) {
    guard += 1;
    const r = rand(rows);
    const c = rand(half);
    const i = r * cols + c;
    if (target[i]) continue;
    target[i] = true;
    target[r * cols + (cols - 1 - c)] = true;
    placed += 1;
  }
  return {
    kind: "mirror",
    prompt: "Maak het spiegelbeeld af",
    setup: "Links staat vast. Tik rechts tot het hetzelfde is, gespiegeld. Dan Klaar.",
    cols,
    rows,
    target,
    teach: "De stippellijn is de spiegel. Wat links zit, zit rechts even ver van de lijn.",
    hint: "Kijk per rij. Wat links aan staat, moet rechts ook aan.",
    tag: "spiegel",
  };
}
