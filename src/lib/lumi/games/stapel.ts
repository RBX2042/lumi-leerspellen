import type { Beat, GroupKey, TilesQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { BUILD_WORDS, pick, shuffle } from "../interact-util.ts";

export function stapel(group: GroupKey, _level: number, beat: Beat): TilesQuestion {
  const g = groupIndex(group);
  const pool = g <= 2 ? BUILD_WORDS.easy : g <= 4 ? BUILD_WORDS.mid : BUILD_WORDS.hard;
  const word = pick(pool);
  const extras = shuffle("aeioulnrstk".split("").filter((l) => !word.includes(l))).slice(0, beat === "boss" ? 2 : 1);
  const tiles = shuffle([...word.split(""), ...extras]);
  return {
    kind: "tiles",
    prompt: `Bouw het woord`,
    setup: g <= 2 ? "Tik de letters in de goede volgorde." : "Zeg het woord in je hoofd, dan de letters.",
    word,
    tiles,
    teach: `Het woord is “${word}”. ${word.length} letters, van links naar rechts. Zeg hem nog eens.`,
    hint: `Het woord heeft ${word.length} letters. Eerste letter: ${word[0]!.toUpperCase()}.`,
    tag: word,
  };
}
