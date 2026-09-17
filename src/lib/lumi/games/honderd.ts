import type { Beat, GridQuestion, GroupKey } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, pick } from "../interact-util.ts";

export function honderd(group: GroupKey, _level: number, beat: Beat): GridQuestion {
  const g = groupIndex(group);
  let max = 10;
  let cols = 5;
  if (g <= 1) {
    max = 10;
    cols = 5;
  } else if (g === 2) {
    max = 20;
    cols = 5;
  } else if (g <= 4) {
    max = beat === "warmup" ? 20 : 50;
    cols = 10;
  } else {
    max = 100;
    cols = 10;
  }
  const window = Math.min(max, cols <= 5 ? max : beat === "boss" ? 50 : 40);
  let start = 1;
  if (max > window) {
    const row = Math.floor(between(0, max - window) / cols) * cols;
    start = row + 1;
  }
  const cells = Array.from({ length: window }, (_, i) => start + i).filter((n) => n <= max);
  const answer = pick(cells);
  const rowStart = Math.floor((answer - 1) / 10) * 10 + 1;
  const ones = answer % 10;
  return {
    kind: "grid",
    prompt: `Tik het vak van ${answer}`,
    setup: cols === 10 ? "Elke rij is tien. De kolom is het laatste cijfer." : "Tel mee. Tik het goede vak.",
    cols,
    cells,
    answer,
    teach:
      cols === 10
        ? `${answer} staat in de rij van ${rowStart} tot ${rowStart + 9}. Laatste cijfer is ${ones}.`
        : `${answer} telt vanaf 1. Wijs mee tot je hem hebt.`,
    hint: cols === 10 ? `Laatste cijfer ${ones}. Rij vanaf ${rowStart}.` : "Tel hardop vanaf het eerste vak.",
    tag: String(answer),
  };
}
