import type { Beat, GroupKey, PieQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { between, pick } from "../interact-util.ts";

export function taart(group: GroupKey, _level: number, beat: Beat): PieQuestion {
  const g = groupIndex(group);
  let slices = 4;
  if (g <= 2) slices = beat === "boss" ? 4 : 2;
  else if (g <= 4) slices = pick(beat === "warmup" ? [2, 4] : [3, 4, 6]);
  else slices = pick(beat === "warmup" ? [4, 6] : [4, 6, 8]);
  const need = beat === "warmup" ? 1 : between(1, slices - (slices > 2 ? 1 : 0));
  const names: Record<number, [string, string]> = {
    2: ["de helft", "twee helften"],
    3: ["een derde", "derden"],
    4: ["een kwart", "kwart"],
    6: ["een zesde", "zesden"],
    8: ["een achtste", "achtsten"],
  };
  const pair = names[slices] ?? ["een deel", "delen"];
  const label =
    need === 1
      ? pair[0]
      : slices === 4 && need === 2
        ? "de helft"
        : slices === 4 && need === 3
          ? "drie kwart"
          : slices === 2 && need === 2
            ? "de hele taart"
            : `${need} ${pair[1]}`;
  return {
    kind: "pie",
    prompt: `Maak ${label}`,
    setup: "Tik de stukken. Nog eens tikken haalt er één af. Dan Klaar.",
    slices,
    need,
    teach: `De taart is in ${slices} gelijke stukken. ${need} ervan is ${need}/${slices}. Zeg: ${label}.`,
    hint: `Tik ${need} stuk${need === 1 ? "" : "ken"}. Niet meer, niet minder.`,
    tag: `${need}/${slices}`,
  };
}
