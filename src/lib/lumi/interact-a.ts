import type {
  Beat,
  ClockSetQuestion,
  CoinsQuestion,
  FlipQuestion,
  GridQuestion,
  GroupKey,
  LineQuestion,
  PairTapQuestion,
  SortQuestion,
  TilesQuestion,
} from "./types.ts";
import { groupIndex } from "./types.ts";
import { BUILD_WORDS, between, centsLabel, formatSpoken, pick, shuffle } from "./interact-util.ts";

export function maak10(group: GroupKey, level: number, beat: Beat): PairTapQuestion {
  const g = groupIndex(group);
  const target = g <= 2 ? 10 : g <= 4 ? (beat === "boss" ? 20 : 10) : pick([10, 12, 15, 20]);
  const a = between(1, target - 1);
  const b = target - a;
  const numbers: number[] = [a, b];
  let guard = 0;
  while (numbers.length < 6 && guard < 40) {
    guard += 1;
    const n = between(1, Math.max(9, target - 1));
    numbers.push(n);
  }
  return {
    kind: "pairtap",
    prompt: `Tik twee getallen die samen ${target} zijn`,
    target,
    numbers: shuffle(numbers),
    teach: `${a} + ${b} = ${target}. Zoek twee die elkaar aanvullen tot ${target}.`,
    hint: `Een van de twee is ${a}. Wat moet erbij tot ${target}?`,
    tag: `${a}+${b}`,
  };
}
