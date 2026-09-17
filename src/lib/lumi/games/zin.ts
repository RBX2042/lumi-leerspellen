import type { Beat, GroupKey, OrderQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { SENTENCES, pick, shuffle } from "../interact-util.ts";

export function zin(group: GroupKey, _level: number, beat: Beat): OrderQuestion {
  const g = groupIndex(group);
  const pool = g <= 2 ? SENTENCES.easy : g <= 4 ? SENTENCES.mid : SENTENCES.hard;
  const item = pick(pool);
  const extras = beat === "boss" ? item.extra : item.extra.slice(0, 1);
  const words = item.words.map((w, i) => ({ id: `w${i}`, label: w }));
  const extraItems = extras.map((w, i) => ({ id: `x${i}`, label: w }));
  const items = shuffle([...words, ...extraItems]);
  return {
    kind: "order",
    prompt: "Bouw de zin",
    setup: "Tik de woorden op volgorde. Extra woordjes laat je liggen.",
    items,
    answer: words.map((w) => w.id),
    teach: `De zin is: “${item.words.join(" ")}.” Wie of wat eerst, dan de rest.`,
    hint: `Eerste woord: “${item.words[0]}”.`,
    tag: item.words.join(" "),
  };
}
