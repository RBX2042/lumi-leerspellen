import type { Beat, CoinsQuestion, GroupKey } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, centsLabel, pick } from "../interact-util.ts";

export function kassa(group: GroupKey, level: number, beat: Beat): CoinsQuestion {
  const g = groupIndex(group);
  const dens =
    g <= 2 ? [10, 20, 50] : g <= 4 ? [5, 10, 20, 50, 100] : [5, 10, 20, 50, 100, 200];
  let target: number;
  if (g <= 2) target = pick([20, 30, 40, 50, 60]);
  else if (g <= 4) target = pick([35, 45, 70, 80, 90, 120]);
  else target = pick([125, 135, 150, 175, 230, 280]);
  if (beat === "warmup") target = dens[0]! * between(1, 3);
  if (level >= 8 && g >= 5) target = pick([95, 145, 185, 210]);
  return {
    kind: "coins",
    prompt: `Maak ${centsLabel(target)}`,
    setup: "Tik de munten. Tik nog eens om er één terug te nemen.",
    target,
    denominations: dens,
    teach: `Tel de centen tot ${centsLabel(target)}. ${centsLabel(100)} is één euro. Grote munt eerst scheelt tellen.`,
    hint: "Begin met de grootste munt die nog past.",
    tag: centsLabel(target),
  };
}
