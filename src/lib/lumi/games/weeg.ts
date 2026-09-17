import type { BalanceQuestion, Beat, GroupKey } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, pick, shuffle } from "../interact-util.ts";

export function weeg(group: GroupKey, _level: number, beat: Beat): BalanceQuestion {
  const g = groupIndex(group);
  const dens = g <= 2 ? [1, 2, 5] : g <= 4 ? [1, 2, 5, 10] : [1, 2, 5, 10, 20];
  const pickN = beat === "warmup" ? 1 : between(2, g <= 2 ? 2 : 3);
  const chosen: number[] = [];
  for (let i = 0; i < pickN; i++) chosen.push(pick(dens));
  const left = chosen.reduce((a, b) => a + b, 0);
  const needed = [...new Set(chosen)];
  const extra = dens.filter((d) => !needed.includes(d));
  const weights = shuffle([...needed, ...extra]);
  return {
    kind: "balance",
    prompt: `Maak ${left} aan de andere kant`,
    setup: "Tik gewichten op de rechterschaal. Terug haalt de laatste eraf.",
    left,
    weights: shuffle(weights),
    teach: `Links weegt ${left}. Rechts moet hetzelfde zijn. ${chosen.join(" + ")} = ${left}.`,
    hint: "Begin met het grootste gewicht dat nog past.",
    tag: String(left),
  };
}
