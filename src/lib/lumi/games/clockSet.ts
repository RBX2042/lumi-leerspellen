import type { ClockSetQuestion } from "../types.ts";
import { formatSpoken } from "../interact-util.ts";

export function clockSet(hours: number, minutes: number, extra?: Partial<ClockSetQuestion>): ClockSetQuestion {
  const spoken = formatSpoken(hours, minutes);
  return {
    kind: "clockset",
    prompt: `Zet de klok op ${spoken}`,
    hours,
    minutes,
    teach:
      minutes === 0
        ? `Grote wijzer op 12, kleine op ${hours}. Precies ${spoken}.`
        : `Grote wijzer telt de minuten (elk cijfer is vijf). Kleine wijzer het uur. ${spoken}.`,
    hint: "Sleep de wijzers. Grote wijzer = minuten, kleine = uur.",
    tag: spoken,
    ...extra,
  };
}
