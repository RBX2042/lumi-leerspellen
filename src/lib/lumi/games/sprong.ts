import type { Beat, GroupKey, LineQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, pick } from "../interact-util.ts";

export function sprong(group: GroupKey, level: number, beat: Beat): LineQuestion {
  const g = groupIndex(group);
  let min = 0;
  let max = 10;
  let step = 1;
  if (g <= 1) {
    max = 10;
  } else if (g === 2) {
    max = 20;
  } else if (g <= 4) {
    max = beat === "boss" ? 40 : 20;
    step = level >= 6 ? 2 : 1;
  } else {
    max = 100;
    step = beat === "warmup" ? 5 : pick([5, 10]);
  }
  const from = beat === "core" && g >= 2 ? between(min, max - step * 2) : min;
  const jumps = beat === "boss" ? between(2, 4) : between(1, 3);
  let answer = from + jumps * step;
  if (answer > max) answer = max;
  if (answer === from) answer = Math.min(max, from + step);
  const prompt =
    from === min
      ? `Zet de steen op ${answer}`
      : `Je staat op ${from}. Spring ${jumps === 1 ? "één" : jumps} keer +${step}. Waar land je?`;
  return {
    kind: "line",
    prompt,
    min,
    max,
    step,
    answer,
    from,
    teach:
      from === min
        ? `Tel de streepjes tot ${answer}. Elke streep is ${step}.`
        : `Start bij ${from}. ${jumps} sprongen van ${step}: ${from} → ${answer}.`,
    hint: from === min ? "Tik het streepje. Tel hardop vanaf nul." : `Begin bij ${from}. Tel ${step} verder.`,
    tag: String(answer),
  };
}
