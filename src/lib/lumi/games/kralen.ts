import type { BeadsQuestion, Beat, GroupKey } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between } from "../interact-util.ts";

export function kralen(group: GroupKey, _level: number, beat: Beat): BeadsQuestion {
  const g = groupIndex(group);
  const rows: 1 | 2 = g <= 1 || beat === "warmup" ? 1 : 2;
  const max = rows * 10;
  const target = between(1, beat === "boss" ? max : Math.max(3, max - 2));
  return {
    kind: "beads",
    prompt: `Schuif tot ${target}`,
    setup: "Tik een kraal. Alles ernaartoe schuift mee. Vijf rood, vijf wit.",
    target,
    rows,
    teach:
      target <= 5
        ? `${target} is ${target} kralen op de eerste rij. Je hoeft niet verder te tellen dan vijf.`
        : target <= 10
          ? `${target} is vijf plus ${target - 5}. De witte kralen ernaast.`
          : `${target} is tien op de bovenste rij, plus ${target - 10} eronder.`,
    hint: target <= 10 ? "Eén rij. Tik de kraal die het getal is." : "Bovenste rij vol = 10. Daarna de onderste.",
    tag: String(target),
  };
}
