export function rand(n: number): number {
  return Math.floor(Math.random() * n);
}
export function pick<T>(arr: readonly T[]): T {
  return arr[rand(arr.length)]!;
}
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
export function between(min: number, max: number): number {
  return min + rand(max - min + 1);
}

export const BUILD_WORDS: Record<"easy" | "mid" | "hard", string[]> = {
  easy: ["kat", "vis", "pen", "rok", "mus", "sok", "mes", "dal", "bos", "jas"],
  mid: ["fiets", "school", "trein", "huis", "boek", "stoel", "maan", "boom", "water", "appel"],
  hard: ["tijd", "geit", "altijd", "thuis", "blauw", "antwoord", "fietsen", "konijn", "schoolbord"],
};

export const HUNT_WORDS: Record<"easy" | "mid" | "hard", string[]> = {
  easy: ["kat", "vis", "pen", "zon", "bos", "jas", "mes", "rok"],
  mid: ["huis", "boek", "maan", "boom", "auto", "doos", "vis", "peer"],
  hard: ["fiets", "trein", "school", "water", "appel", "stoel", "blauw"],
};

export const SENTENCES: Record<"easy" | "mid" | "hard", { words: string[]; extra: string[] }[]> = {
  easy: [
    { words: ["De", "kat", "zit"], extra: ["op"] },
    { words: ["Ik", "zie", "oma"], extra: ["een"] },
    { words: ["Het", "is", "warm"], extra: ["koud"] },
    { words: ["Wij", "gaan", "fietsen"], extra: ["naar"] },
    { words: ["De", "zon", "schijnt"], extra: ["regen"] },
  ],
  mid: [
    { words: ["De", "kat", "zit", "op", "de", "mat"], extra: ["onder"] },
    { words: ["Wij", "gaan", "naar", "school"], extra: ["thuis"] },
    { words: ["Het", "boek", "ligt", "op", "tafel"], extra: ["onder"] },
    { words: ["Ik", "lees", "een", "boek"], extra: ["schrijf"] },
    { words: ["De", "fiets", "staat", "buiten"], extra: ["binnen"] },
  ],
  hard: [
    { words: ["Gisteren", "fietste", "ik", "naar", "school"], extra: ["morgen", "loop"] },
    { words: ["De", "juf", "leest", "een", "verhaal", "voor"], extra: ["schrijft"] },
    { words: ["Morgen", "gaan", "wij", "naar", "oma"], extra: ["gisteren"] },
    { words: ["Het", "paard", "drinkt", "water", "uit", "de", "bak"], extra: ["eet"] },
  ],
};

export function neighbors(i: number, cols: number, total: number): number[] {
  const r = Math.floor(i / cols);
  const c = i % cols;
  const out: number[] = [];
  if (c > 0) out.push(i - 1);
  if (c < cols - 1) out.push(i + 1);
  if (r > 0) out.push(i - cols);
  if (r < Math.floor((total - 1) / cols)) out.push(i + cols);
  return out;
}

export function canTraceWord(letters: string[], cols: number, word: string): boolean {
  const total = letters.length;
  const starts = letters.map((ch, i) => (ch === word[0] ? i : -1)).filter((i) => i >= 0);
  const walk = (at: number, k: number, used: Set<number>): boolean => {
    if (k === word.length) return true;
    for (const n of neighbors(at, cols, total)) {
      if (used.has(n) || letters[n] !== word[k]) continue;
      const next = new Set(used);
      next.add(n);
      if (walk(n, k + 1, next)) return true;
    }
    return false;
  };
  return starts.some((s) => walk(s, 1, new Set([s])));
}

export function formatSpoken(h: number, m: number): string {
  const hh = ((h + 11) % 12) + 1;
  if (m === 0) return `${hh} uur`;
  if (m === 15) return `kwart over ${hh}`;
  if (m === 30) return `half ${hh === 12 ? 1 : hh + 1}`;
  if (m === 45) return `kwart voor ${hh === 12 ? 1 : hh + 1}`;
  if (m < 30) return `${m} over ${hh}`;
  return `${60 - m} voor ${hh === 12 ? 1 : hh + 1}`;
}

export function centsLabel(cents: number): string {
  if (cents % 100 === 0) return `€${cents / 100}`;
  const euro = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return `€${euro},${rest}`;
}
