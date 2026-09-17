import type { Beat, GroupKey, PathQuestion } from "../types.ts";
import { groupIndex } from "../types.ts";
import { HUNT_WORDS, pick } from "../interact-util.ts";
import { placeWord } from "./placeWord.ts";

export function jacht(group: GroupKey, _level: number, beat: Beat): PathQuestion {
  const g = groupIndex(group);
  const pool = g <= 2 ? HUNT_WORDS.easy : g <= 4 ? HUNT_WORDS.mid : HUNT_WORDS.hard;
  const word = pick(pool);
  const cols = word.length > 5 || beat === "boss" ? 5 : 4;
  const rows = cols;
  const letters = placeWord(word, cols, rows);
  return {
    kind: "path",
    prompt: `Trek “${word}”`,
    setup: "Tik letters die naast elkaar liggen. Fout pad? Tik het eerste vak opnieuw.",
    cols,
    letters,
    word,
    teach: `Het woord is “${word}”. ${word.length} letters, aan elkaar vast in het rooster. Zeg hem terwijl je tikt.`,
    hint: `Begin bij de ${word[0]!.toUpperCase()}. Daarna een buurman.`,
    tag: word,
  };
}
