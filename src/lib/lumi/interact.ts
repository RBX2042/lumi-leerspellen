import type {
  BalanceQuestion,
  BeadsQuestion,
  Beat,
  ClockSetQuestion,
  CoinsQuestion,
  FlipQuestion,
  GridQuestion,
  GroupKey,
  LineQuestion,
  MirrorQuestion,
  OrderQuestion,
  PairTapQuestion,
  PathQuestion,
  PieQuestion,
  Question,
  SortQuestion,
  TilesQuestion,
} from "./types.ts";
import { groupIndex } from "./types.ts";

function rand(n: number): number {
  return Math.floor(Math.random() * n);
}
function pick<T>(arr: readonly T[]): T {
  return arr[rand(arr.length)]!;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
function between(min: number, max: number): number {
  return min + rand(max - min + 1);
}

const BUILD_WORDS: Record<"easy" | "mid" | "hard", string[]> = {
  easy: ["kat", "vis", "pen", "rok", "mus", "sok", "mes", "dal", "bos", "jas"],
  mid: ["fiets", "school", "trein", "huis", "boek", "stoel", "maan", "boom", "water", "appel"],
  hard: ["tijd", "geit", "altijd", "thuis", "blauw", "antwoord", "fietsen", "konijn", "schoolbord"],
};

const HUNT_WORDS: Record<"easy" | "mid" | "hard", string[]> = {
  easy: ["kat", "vis", "pen", "zon", "bos", "jas", "mes", "rok"],
  mid: ["huis", "boek", "maan", "boom", "auto", "doos", "vis", "peer"],
  hard: ["fiets", "trein", "school", "water", "appel", "stoel", "blauw"],
};

const SENTENCES: Record<"easy" | "mid" | "hard", { words: string[]; extra: string[] }[]> = {
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

export function isPlayBoard(q: Question): boolean {
  return (
    q.kind === "line" ||
    q.kind === "tiles" ||
    q.kind === "clockset" ||
    q.kind === "sort" ||
    q.kind === "pairtap" ||
    q.kind === "coins" ||
    q.kind === "flip" ||
    q.kind === "grid" ||
    q.kind === "pie" ||
    q.kind === "beads" ||
    q.kind === "order" ||
    q.kind === "path" ||
    q.kind === "balance" ||
    q.kind === "mirror"
  );
}

export function answerLabel(q: Question): string | undefined {
  if (q.kind === "choice") return q.choices[q.answer];
  if (q.kind === "tap") return q.answer;
  if (q.kind === "line") return String(q.answer);
  if (q.kind === "tiles") return q.word;
  if (q.kind === "clockset") return formatSpoken(q.hours, q.minutes);
  if (q.kind === "sort") return `${q.left.label} / ${q.right.label}`;
  if (q.kind === "pairtap") return String(q.target);
  if (q.kind === "coins") return centsLabel(q.target);
  if (q.kind === "flip") return "alle paren";
  if (q.kind === "grid") return String(q.answer);
  if (q.kind === "pie") return `${q.need}/${q.slices}`;
  if (q.kind === "beads") return String(q.target);
  if (q.kind === "order") return q.answer.map((id) => q.items.find((it) => it.id === id)?.label ?? id).join(" ");
  if (q.kind === "path") return q.word;
  if (q.kind === "balance") return String(q.left);
  if (q.kind === "mirror") return "spiegelbeeld";
  return undefined;
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

export function maak10(group: GroupKey, level: number, beat: Beat): PairTapQuestion {
  const g = groupIndex(group);
  const target = g <= 2 ? 10 : g <= 4 ? (beat === "boss" ? 20 : 10) : pick([10, 12, 15, 20]);
  const a = between(1, target - 1);
  const b = target - a;
  const numbers: number[] = [a, b];
  let guard = 0;
  while (numbers.length < 6 && guard < 40) {
    guard += 1;
    const n = between(1, Math.max(9, target - 1));
    numbers.push(n);
  }
  return {
    kind: "pairtap",
    prompt: `Tik twee getallen die samen ${target} zijn`,
    target,
    numbers: shuffle(numbers),
    teach: `${a} + ${b} = ${target}. Zoek twee die elkaar aanvullen tot ${target}.`,
    hint: `Een van de twee is ${a}. Wat moet erbij tot ${target}?`,
    tag: `${a}+${b}`,
  };
}

export function sprong(group: GroupKey, level: number, beat: Beat): LineQuestion {
  const g = groupIndex(group);
  let min = 0;
  let max = 10;
  let step = 1;
  if (g <= 1) {
    max = 10;
  } else if (g === 2) {
    max = 20;
  } else if (g <= 4) {
    max = beat === "boss" ? 40 : 20;
    step = level >= 6 ? 2 : 1;
  } else {
    max = 100;
    step = beat === "warmup" ? 5 : pick([5, 10]);
  }
  const from = beat === "core" && g >= 2 ? between(min, max - step * 2) : min;
  const jumps = beat === "boss" ? between(2, 4) : between(1, 3);
  let answer = from + jumps * step;
  if (answer > max) answer = max;
  if (answer === from) answer = Math.min(max, from + step);
  const prompt =
    from === min
      ? `Zet de steen op ${answer}`
      : `Je staat op ${from}. Spring ${jumps === 1 ? "één" : jumps} keer +${step}. Waar land je?`;
  return {
    kind: "line",
    prompt,
    min,
    max,
    step,
    answer,
    from,
    teach:
      from === min
        ? `Tel de streepjes tot ${answer}. Elke streep is ${step}.`
        : `Start bij ${from}. ${jumps} sprongen van ${step}: ${from} → ${answer}.`,
    hint: from === min ? "Tik het streepje. Tel hardop vanaf nul." : `Begin bij ${from}. Tel ${step} verder.`,
    tag: String(answer),
  };
}

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

export function bakken(group: GroupKey, _level: number, beat: Beat): SortQuestion {
  const g = groupIndex(group);
  const mode = g <= 2 ? 0 : g <= 4 ? (beat === "warmup" ? 0 : 1) : pick([1, 2]);
  if (mode === 0) {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6);
    return {
      kind: "sort",
      prompt: "Sleep naar even of oneven",
      left: { label: "Even", key: "even" },
      right: { label: "Oneven", key: "odd" },
      items: nums.map((n, i) => ({
        id: `n${i}`,
        label: String(n),
        bucket: n % 2 === 0 ? "even" : "odd",
      })),
      teach: "Even eindigt op 0, 2, 4, 6, 8. Oneven op 1, 3, 5, 7, 9. Kijk naar het laatste cijfer.",
      hint: "Kijk alleen naar het laatste cijfer.",
      tag: "even-oneven",
    };
  }
  if (mode === 1) {
    const ei = ["trein", "geit", "klein", "ei", "plein"];
    const ij = ["tijd", "wijd", "ijs", "dijk", "blij"];
    const mix = shuffle([
      ...ei.slice(0, 3).map((w) => ({ w, bucket: "ei" })),
      ...ij.slice(0, 3).map((w) => ({ w, bucket: "ij" })),
    ]);
    return {
      kind: "sort",
      prompt: "ei of ij?",
      left: { label: "ei", key: "ei" },
      right: { label: "ij", key: "ij" },
      items: mix.map((x, i) => ({ id: `w${i}`, label: x.w, bucket: x.bucket })),
      teach: "Zeg het woord. ei klinkt als in trein, ij als in tijd. Je hoort hetzelfde, je schrijft het verschil.",
      hint: "Zeg het woord. Denk aan een woord dat je al kent: trein of tijd.",
      tag: "ei-ij",
    };
  }
  const low = shuffle([3, 5, 8, 12, 19, 4]).slice(0, 3);
  const high = shuffle([25, 40, 50, 80, 100, 60]).slice(0, 3);
  const mix = shuffle([
    ...low.map((n) => ({ n, bucket: "lt" })),
    ...high.map((n) => ({ n, bucket: "gt" })),
  ]);
  return {
    kind: "sort",
    prompt: "Kleiner of groter dan 20?",
    left: { label: "< 20", key: "lt" },
    right: { label: "> 20", key: "gt" },
    items: mix.map((x, i) => ({ id: `v${i}`, label: String(x.n), bucket: x.bucket })),
    teach: "20 is de grens. Alles eronder in de linker bak, alles erboven rechts.",
    hint: "Vergelijk met 20. Is het minder of meer?",
    tag: "vergelijken",
  };
}

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

export function draai(group: GroupKey, _level: number, beat: Beat): FlipQuestion {
  const g = groupIndex(group);
  const bonds: [string, string, string][] =
    g <= 2
      ? [
          ["2+3", "5", "a"],
          ["1+4", "5", "b"],
          ["4+4", "8", "c"],
        ]
      : g <= 4
        ? [
            ["6+7", "13", "a"],
            ["8+5", "13", "b"],
            ["9+6", "15", "c"],
          ]
        : [
            ["7×8", "56", "a"],
            ["6×9", "54", "b"],
            ["12×4", "48", "c"],
          ];
  const used = beat === "warmup" ? bonds.slice(0, 2) : bonds;
  const cards = shuffle(
    used.flatMap(([l, r, pair]) => [
      { id: `${pair}l`, face: l, pair },
      { id: `${pair}r`, face: r, pair },
    ]),
  );
  return {
    kind: "flip",
    prompt: "Draai twee kaarten om. Vind de som.",
    setup: "Eerst kijken, dan het paar. Een misser mag — daarna weer.",
    cards,
    teach: "Elk paar is een som en zijn antwoord. Zeg hem hardop als je hem vindt: dan blijft hij zitten.",
    hint: "Draai er één, zeg het antwoord in je hoofd, zoek dat.",
    tag: "paren",
  };
}

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

export function honderd(group: GroupKey, _level: number, beat: Beat): GridQuestion {
  const g = groupIndex(group);
  let max = 10;
  let cols = 5;
  if (g <= 1) {
    max = 10;
    cols = 5;
  } else if (g === 2) {
    max = 20;
    cols = 5;
  } else if (g <= 4) {
    max = beat === "warmup" ? 20 : 50;
    cols = 10;
  } else {
    max = 100;
    cols = 10;
  }
  const window = Math.min(max, cols <= 5 ? max : beat === "boss" ? 50 : 40);
  let start = 1;
  if (max > window) {
    const row = Math.floor(between(0, max - window) / cols) * cols;
    start = row + 1;
  }
  const cells = Array.from({ length: window }, (_, i) => start + i).filter((n) => n <= max);
  const answer = pick(cells);
  const rowStart = Math.floor((answer - 1) / 10) * 10 + 1;
  const ones = answer % 10;
  return {
    kind: "grid",
    prompt: `Tik het vak van ${answer}`,
    setup: cols === 10 ? "Elke rij is tien. De kolom is het laatste cijfer." : "Tel mee. Tik het goede vak.",
    cols,
    cells,
    answer,
    teach:
      cols === 10
        ? `${answer} staat in de rij van ${rowStart} tot ${rowStart + 9}. Laatste cijfer is ${ones}.`
        : `${answer} telt vanaf 1. Wijs mee tot je hem hebt.`,
    hint: cols === 10 ? `Laatste cijfer ${ones}. Rij vanaf ${rowStart}.` : "Tel hardop vanaf het eerste vak.",
    tag: String(answer),
  };
}

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

export function rij(group: GroupKey, _level: number, beat: Beat): OrderQuestion {
  const g = groupIndex(group);
  const mode = g <= 1 ? 0 : g <= 3 ? pick([0, 1]) : beat === "warmup" ? 0 : pick([0, 1, 2]);
  if (mode === 0) {
    const count = g <= 2 ? 4 : 5;
    const start = g <= 2 ? between(1, 6) : between(1, 40);
    const step = g <= 4 ? 1 : pick([1, 2, 5]);
    const nums = Array.from({ length: count }, (_, i) => start + i * step);
    const extra = beat === "boss" ? [start + count * step + step] : [];
    const items = shuffle([...nums, ...extra]).map((n, i) => ({ id: `n${i}-${n}`, label: String(n) }));
    const answer = nums.map((n) => items.find((it) => it.label === String(n))!.id);
    return {
      kind: "order",
      prompt: "Zet van klein naar groot",
      setup: "Tik de getallen in de goede volgorde.",
      items,
      answer,
      teach: `Kleinste eerst: ${nums.join(", ")}. Elk volgende is ${step === 1 ? "één meer" : `+${step}`}.`,
      hint: "Wat is het kleinste? Dat mag eerst.",
      tag: nums.join("-"),
    };
  }
  if (mode === 1) {
    const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];
    const start = between(0, 2);
    const slice = days.slice(start, start + 3);
    const items = shuffle(slice).map((d, i) => ({ id: `d${i}`, label: d }));
    const answer = slice.map((d) => items.find((it) => it.label === d)!.id);
    return {
      kind: "order",
      prompt: "Zet de dagen op volgorde",
      items,
      answer,
      teach: `In de week: ${slice.join(", ")}. Maandag is de eerste schooldag.`,
      hint: "Welke dag komt het eerst in de week?",
      tag: slice[0],
    };
  }
  const sizes = [
    ["muis", "kat", "paard"],
    ["munt", "boek", "tafel"],
    ["druppel", "plas", "zee"],
  ];
  const row = pick(sizes);
  const items = shuffle([...row]).map((w, i) => ({ id: `s${i}`, label: w }));
  const answer = row.map((w) => items.find((it) => it.label === w)!.id);
  return {
    kind: "order",
    prompt: "Zet van klein naar groot",
    items,
    answer,
    teach: `${row[0]} is het kleinst, daarna ${row[1]}, dan ${row[2]}.`,
    hint: "Wat is het kleinst? Dat mag eerst.",
    tag: row.join("-"),
  };
}

function neighbors(i: number, cols: number, total: number): number[] {
  const r = Math.floor(i / cols);
  const c = i % cols;
  const out: number[] = [];
  if (c > 0) out.push(i - 1);
  if (c < cols - 1) out.push(i + 1);
  if (r > 0) out.push(i - cols);
  if (r < Math.floor((total - 1) / cols)) out.push(i + cols);
  return out;
}

function placeSnake(word: string, cols: number, rows: number): string[] {
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

function placeWord(word: string, cols: number, rows: number): string[] {
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

export function weeg(group: GroupKey, _level: number, beat: Beat): BalanceQuestion {
  const g = groupIndex(group);
  const dens = g <= 2 ? [1, 2, 5] : g <= 4 ? [1, 2, 5, 10] : [1, 2, 5, 10, 20];
  const pickN = beat === "warmup" ? 1 : between(2, g <= 2 ? 2 : 3);
  const chosen: number[] = [];
  for (let i = 0; i < pickN; i++) chosen.push(pick(dens));
  const left = chosen.reduce((a, b) => a + b, 0);
  const needed = [...new Set(chosen)];
  const extra = dens.filter((d) => !needed.includes(d));
  const weights = shuffle([...needed, ...extra]);
  return {
    kind: "balance",
    prompt: `Maak ${left} aan de andere kant`,
    setup: "Tik gewichten op de rechterschaal. Terug haalt de laatste eraf.",
    left,
    weights: shuffle(weights),
    teach: `Links weegt ${left}. Rechts moet hetzelfde zijn. ${chosen.join(" + ")} = ${left}.`,
    hint: "Begin met het grootste gewicht dat nog past.",
    tag: String(left),
  };
}

export function spiegel(group: GroupKey, _level: number, beat: Beat): MirrorQuestion {
  const g = groupIndex(group);
  const cols = g <= 2 ? 4 : 6;
  const rows = beat === "warmup" ? 3 : g <= 2 ? 4 : 4;
  const half = cols / 2;
  const target = Array.from({ length: rows * cols }, () => false);
  const fill = beat === "warmup" ? 2 : between(3, Math.min(6, rows * half - 1));
  let placed = 0;
  let guard = 0;
  while (placed < fill && guard < 80) {
    guard += 1;
    const r = rand(rows);
    const c = rand(half);
    const i = r * cols + c;
    if (target[i]) continue;
    target[i] = true;
    target[r * cols + (cols - 1 - c)] = true;
    placed += 1;
  }
  return {
    kind: "mirror",
    prompt: "Maak het spiegelbeeld af",
    setup: "Links staat vast. Tik rechts tot het hetzelfde is, gespiegeld. Dan Klaar.",
    cols,
    rows,
    target,
    teach: "De stippellijn is de spiegel. Wat links zit, zit rechts even ver van de lijn.",
    hint: "Kijk per rij. Wat links aan staat, moet rechts ook aan.",
    tag: "spiegel",
  };
}

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
