import type { Beat, FlipQuestion, GroupKey } from "../types.ts";
import { groupIndex } from "../types.ts";
import { shuffle } from "../interact-util.ts";

export function draai(group: GroupKey, _level: number, beat: Beat): FlipQuestion {
  const g = groupIndex(group);
  const bonds: [string, string, string][] =
    g <= 2
      ? [
          ["2+3", "5", "a"],
          ["1+4", "5", "b"],
          ["4+4", "8", "c"],
        ]
      : g <= 4
        ? [
            ["6+7", "13", "a"],
            ["8+5", "13", "b"],
            ["9+6", "15", "c"],
          ]
        : [
            ["7×8", "56", "a"],
            ["6×9", "54", "b"],
            ["12×4", "48", "c"],
          ];
  const used = beat === "warmup" ? bonds.slice(0, 2) : bonds;
  const cards = shuffle(
    used.flatMap(([l, r, pair]) => [
      { id: `${pair}l`, face: l, pair },
      { id: `${pair}r`, face: r, pair },
    ]),
  );
  return {
    kind: "flip",
    prompt: "Draai twee kaarten om. Vind de som.",
    setup: "Eerst kijken, dan het paar. Een misser mag — daarna weer.",
    cards,
    teach: "Elk paar is een som en zijn antwoord. Zeg hem hardop als je hem vindt: dan blijft hij zitten.",
    hint: "Draai er één, zeg het antwoord in je hoofd, zoek dat.",
    tag: "paren",
  };
}
