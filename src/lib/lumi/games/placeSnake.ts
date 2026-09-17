import { pick } from "../interact-util.ts";

export function placeSnake(word: string, cols: number, rows: number): string[] {
  const total = cols * rows;
  const letters = Array.from({ length: total }, () => pick("aeioulnrstkbpmvg".split("")));
  let r = 0;
  let c = 0;
  let dir = 1;
  for (let i = 0; i < word.length; i++) {
    letters[r * cols + c] = word[i]!;
    if (i === word.length - 1) break;
    const nextC = c + dir;
    if (nextC >= 0 && nextC < cols) {
      c = nextC;
    } else {
      r += 1;
      dir *= -1;
      if (r >= rows) break;
    }
  }
  return letters;
}
