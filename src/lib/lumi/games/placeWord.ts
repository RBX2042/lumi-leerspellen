import { canTraceWord, neighbors, pick, rand } from "../interact-util.ts";
import { placeSnake } from "./placeSnake.ts";

export function placeWord(word: string, cols: number, rows: number): string[] {
  const total = cols * rows;
  for (let attempt = 0; attempt < 40; attempt++) {
    const used = new Set<number>();
    const path: number[] = [];
    let at = rand(total);
    path.push(at);
    used.add(at);
    let ok = true;
    for (let k = 1; k < word.length; k++) {
      const opts = neighbors(at, cols, total).filter((n) => !used.has(n));
      if (!opts.length) {
        ok = false;
        break;
      }
      at = pick(opts);
      path.push(at);
      used.add(at);
    }
    if (!ok) continue;
    const letters = Array.from({ length: total }, () => pick("aeioulnrstkbpmvg".split("")));
    path.forEach((idx, i) => {
      letters[idx] = word[i]!;
    });
    if (canTraceWord(letters, cols, word)) return letters;
  }
  return placeSnake(word, cols, rows);
}
