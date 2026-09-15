import type { Beat, GameId, GroupKey, Question, ShapeItem, Visual } from "./types.ts";
import { groupIndex } from "./types.ts";
import { defaultHint } from "./coach.ts";
import { bakken, clockSet, draai, honderd, jacht, kassa, kralen, maak10, rij, spiegel, sprong, stapel, taart, weeg, zin } from "./interact.ts";

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

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const WORDS_START: Record<string, string[]> = {
  a: ["aap", "auto", "appel", "aas"],
  b: ["boom", "beer", "boek", "boot"],
  d: ["dak", "doos", "duif", "deur"],
  e: ["eend", "egel", "ezel"],
  f: ["fiets", "fles", "foto"],
  g: ["geit", "gat", "goud"],
  h: ["huis", "haan", "hoed", "hond"],
  i: ["ijs", "ijsje"],
  k: ["kat", "koek", "kies", "kip"],
  l: ["lamp", "leeuw", "lepel"],
  m: ["maan", "muis", "melk", "mes"],
  n: ["neus", "noot", "net"],
  o: ["oog", "oor", "oma"],
  p: ["pen", "peer", "poes", "paard"],
  r: ["raam", "roos", "rok"],
  s: ["zon", "sok", "stoel", "schip"],
  t: ["tafel", "tak", "trein"],
  u: ["uil", "uur"],
  v: ["vis", "vos", "veer", "vuur"],
  w: ["wolk", "water", "wiel"],
  z: ["zon", "zee", "zaag"],
};

const RHYMES: { word: string; rhyme: string; no: string[] }[] = [
  { word: "kat", rhyme: "rat", no: ["kop", "pen", "stoel"] },
  { word: "huis", rhyme: "muis", no: ["boom", "vis", "boek"] },
  { word: "pen", rhyme: "hen", no: ["pan", "pil", "pet"] },
  { word: "maan", rhyme: "haan", no: ["muur", "vis", "boek"] },
  { word: "stoel", rhyme: "poel", no: ["tafel", "raam", "deur"] },
  { word: "boom", rhyme: "stroom", no: ["blad", "huis", "kat"] },
  { word: "vis", rhyme: "is", no: ["vos", "vat", "veer"] },
  { word: "boek", rhyme: "doek", no: ["boot", "bal", "pen"] },
];

const SPELLING: { wrong: string; right: string; why: string }[] = [
  { wrong: "fies", right: "fiets", why: "ie + ts" },
  { wrong: "isje", right: "ijsje", why: "ij" },
  { wrong: "antwwoord", right: "antwoord", why: "niet dubbel" },
  { wrong: "mischien", right: "misschien", why: "sch" },
  { wrong: "eigelijk", right: "eigenlijk", why: "lijk" },
  { wrong: "word", right: "wordt", why: "hij wordt, d/t" },
  { wrong: "hij rund", right: "hij rent", why: "stam + t" },
  { wrong: "ik word moe", right: "ik word moe", why: "ik word, zonder t" },
  { wrong: "vind", right: "vindt", why: "hij vindt" },
  { wrong: "nouw", right: "nauw", why: "au" },
  { wrong: "gauw", right: "gauw", why: "au" },
  { wrong: "leukke", right: "leuke", why: "open lettergreep" },
  { wrong: "bomen", right: "bomen", why: "meervoud" },
  { wrong: "huizen", right: "huizen", why: "z van huis" },
  { wrong: "schooltje", right: "schooltje", why: "verkleinwoord" },
  { wrong: "konijntje", right: "konijntje", why: "ij" },
  { wrong: "cijfer", right: "cijfer", why: "ij" },
  { wrong: "seizoen", right: "seizoen", why: "ei" },
  { wrong: "trein", right: "trein", why: "ei" },
  { wrong: "wijd", right: "wijd", why: "ij" },
  { wrong: "klein", right: "klein", why: "ei" },
  { wrong: "tijd", right: "tijd", why: "ij" },
  { wrong: "geit", right: "geit", why: "ei" },
  { wrong: "dijk", right: "dijk", why: "ij" },
  { wrong: "hij speeld", right: "hij speelt", why: "stam + t" },
  { wrong: "ik speelt", right: "ik speel", why: "ik + stam" },
  { wrong: "hondt", right: "hond", why: "geen extra t" },
  { wrong: "paart", right: "paard", why: "d op het eind klinkt als t" },
  { wrong: "hont", right: "hond", why: "d op het eind" },
  { wrong: "rijst", right: "rijst", why: "ij" },
  { wrong: "hij word", right: "hij wordt", why: "stam + t" },
  { wrong: "ik wordt", right: "ik word", why: "ik + stam, geen t" },
  { wrong: "zij loopd", right: "zij loopt", why: "stam + t" },
  { wrong: "gebeurd", right: "gebeurt", why: "stam gebeur + t" },
  { wrong: "antwoordt", right: "antwoord", why: "zelfstandig naamwoord" },
  { wrong: "hij antwoord", right: "hij antwoordt", why: "stam + t" },
  { wrong: "altijd", right: "altijd", why: "ij" },
  { wrong: "alteid", right: "altijd", why: "ij" },
  { wrong: "alleen", right: "alleen", why: "twee l, twee e" },
  { wrong: "alen", right: "alleen", why: "alleen" },
  { wrong: "misschien", right: "misschien", why: "sch" },
  { wrong: "misschien", right: "misschien", why: "sch" },
  { wrong: "nou", right: "nauw", why: "au in nauw" },
  { wrong: "vrouw", right: "vrouw", why: "ou" },
  { wrong: "blauw", right: "blauw", why: "au" },
  { wrong: "blouw", right: "blauw", why: "au" },
  { wrong: "thuis", right: "thuis", why: "ui" },
  { wrong: "tuis", right: "thuis", why: "th" },
  { wrong: "school", right: "school", why: "oo" },
  { wrong: "schol", right: "school", why: "oo" },
  { wrong: "hij heeft", right: "hij heeft", why: "stam heb + t, f van v" },
  { wrong: "hij heefd", right: "hij heeft", why: "f, niet d" },
  { wrong: "ik heeft", right: "ik heb", why: "ik + stam" },
  { wrong: "wij heb", right: "wij hebben", why: "meervoud" },
  { wrong: "broer", right: "broer", why: "oe" },
  { wrong: "broor", right: "broer", why: "oe" },
  { wrong: "auto", right: "auto", why: "au" },
  { wrong: "outo", right: "auto", why: "au" },
  { wrong: "ei", right: "ei", why: "ei van ei" },
  { wrong: "ij", right: "ei", why: "ei van het ei" },
  { wrong: "hij zeid", right: "hij zei", why: "verleden tijd van zeggen" },
  { wrong: "hij zei", right: "hij zei", why: "verleden tijd" },
  { wrong: "misschien", right: "misschien", why: "sch" },
  { wrong: "rustig", right: "rustig", why: "ig" },
  { wrong: "rustich", right: "rustig", why: "ig, niet ch" },
  { wrong: "vriend", right: "vriend", why: "d op het eind" },
  { wrong: "vrient", right: "vriend", why: "d, klinkt als t" },
  { wrong: "hond", right: "hond", why: "d op het eind" },
  { wrong: "hoofd", right: "hoofd", why: "d" },
  { wrong: "hooft", right: "hoofd", why: "d, klinkt als t" },
];

const FILL: { stem: string; answer: string; options: string[] }[] = [
  { stem: "sch_ol", answer: "oo", options: ["oo", "o", "oe", "ou"] },
  { stem: "b_m", answer: "oo", options: ["oo", "o", "oe", "ou"] },
  { stem: "h_s", answer: "ui", options: ["ui", "uu", "oe", "ie"] },
  { stem: "m_n", answer: "aa", options: ["aa", "a", "ae", "ao"] },
  { stem: "v_s", answer: "i", options: ["i", "ie", "ij", "ei"] },
  { stem: "f_ts", answer: "ie", options: ["ie", "i", "ij", "ee"] },
  { stem: "tr_n", answer: "ei", options: ["ei", "ij", "ee", "ie"] },
  { stem: "t_d", answer: "ij", options: ["ij", "ei", "ie", "i"] },
  { stem: "kl_n", answer: "ei", options: ["ei", "ij", "ee", "ai"] },
  { stem: "w_d", answer: "ij", options: ["ij", "ei", "ie", "y"] },
  { stem: "p_rd", answer: "aa", options: ["aa", "a", "ae", "ao"] },
  { stem: "str_t", answer: "aa", options: ["aa", "a", "ae", "ah"] },
  { stem: "b_k", answer: "oe", options: ["oe", "oo", "eu", "ui"] },
  { stem: "gr_n", answer: "oe", options: ["oe", "oo", "eu", "u"] },
  { stem: "d_r", answer: "eu", options: ["eu", "ui", "uu", "oe"] },
  { stem: "st_l", answer: "oe", options: ["oe", "oo", "eu", "u"] },
  { stem: "m_s", answer: "ui", options: ["ui", "uu", "oe", "eu"] },
  { stem: "v_r", answer: "uu", options: ["uu", "u", "oe", "ui"] },
  { stem: "z_n", answer: "o", options: ["o", "oo", "oa", "ou"] },
  { stem: "k_p", answer: "o", options: ["o", "oo", "oe", "ou"] },
  { stem: "l_pel", answer: "e", options: ["e", "ee", "ei", "eu"] },
];

const PROVINCES = [
  { id: "groningen", name: "Groningen", capital: "Groningen" },
  { id: "friesland", name: "Friesland", capital: "Leeuwarden" },
  { id: "drenthe", name: "Drenthe", capital: "Assen" },
  { id: "overijssel", name: "Overijssel", capital: "Zwolle" },
  { id: "flevoland", name: "Flevoland", capital: "Lelystad" },
  { id: "gelderland", name: "Gelderland", capital: "Arnhem" },
  { id: "utrecht", name: "Utrecht", capital: "Utrecht" },
  { id: "noord-holland", name: "Noord-Holland", capital: "Haarlem" },
  { id: "zuid-holland", name: "Zuid-Holland", capital: "Den Haag" },
  { id: "zeeland", name: "Zeeland", capital: "Middelburg" },
  { id: "noord-brabant", name: "Noord-Brabant", capital: "Den Bosch" },
  { id: "limburg", name: "Limburg", capital: "Maastricht" },
] as const;

const CITIES: { city: string; province: string }[] = [
  { city: "Amsterdam", province: "Noord-Holland" },
  { city: "Rotterdam", province: "Zuid-Holland" },
  { city: "Utrecht", province: "Utrecht" },
  { city: "Eindhoven", province: "Noord-Brabant" },
  { city: "Groningen", province: "Groningen" },
  { city: "Tilburg", province: "Noord-Brabant" },
  { city: "Almere", province: "Flevoland" },
  { city: "Breda", province: "Noord-Brabant" },
  { city: "Nijmegen", province: "Gelderland" },
  { city: "Haarlem", province: "Noord-Holland" },
  { city: "Arnhem", province: "Gelderland" },
  { city: "Enschede", province: "Overijssel" },
  { city: "Maastricht", province: "Limburg" },
  { city: "Zwolle", province: "Overijssel" },
  { city: "Leeuwarden", province: "Friesland" },
];

const WORLD: { prompt: string; answer: string; distractors: string[]; teach: string }[] = [
  {
    prompt: "Welk land ligt ten zuiden van Nederland?",
    answer: "België",
    distractors: ["Duitsland", "Frankrijk", "Denemarken"],
    teach: "Zuid is onderaan de kaart. Daar ligt België, tegen Limburg en Brabant.",
  },
  {
    prompt: "Welk land ligt ten oosten van Nederland?",
    answer: "Duitsland",
    distractors: ["België", "Engeland", "Polen"],
    teach: "Oost is rechts op de kaart. Daar ligt Duitsland, een lange grens.",
  },
  {
    prompt: "Wat is de hoofdstad van Nederland?",
    answer: "Amsterdam",
    distractors: ["Den Haag", "Rotterdam", "Utrecht"],
    teach: "Amsterdam is de hoofdstad. De regering zit in Den Haag — dat is iets anders.",
  },
  {
    prompt: "Waar zit de Nederlandse regering?",
    answer: "Den Haag",
    distractors: ["Amsterdam", "Rotterdam", "Haarlem"],
    teach: "De regering en de koning werken in Den Haag. Amsterdam is de hoofdstad.",
  },
  {
    prompt: "Hoeveel provincies heeft Nederland?",
    answer: "12",
    distractors: ["10", "11", "14"],
    teach: "Twaalf provincies. Zeg ze in drie groepen: noord, midden, zuid.",
  },
  {
    prompt: "Welke zee ligt ten noorden van Nederland?",
    answer: "Noordzee",
    distractors: ["Oostzee", "Middellandse Zee", "Zwarte Zee"],
    teach: "Boven Nederland, west en noord, ligt de Noordzee. De naam zegt het.",
  },
  {
    prompt: "Welk land ligt niet aan Nederland?",
    answer: "Frankrijk",
    distractors: ["België", "Duitsland", "Nederland"],
    teach: "Aan Nederland liggen België en Duitsland. Frankrijk zit dááronder, achter België.",
  },
  {
    prompt: "Wat is de hoofdstad van België?",
    answer: "Brussel",
    distractors: ["Antwerpen", "Luik", "Gent"],
    teach: "Brussel is de hoofdstad van België. Antwerpen is een havenstad.",
  },
  {
    prompt: "Wat is de hoofdstad van Duitsland?",
    answer: "Berlijn",
    distractors: ["München", "Hamburg", "Keulen"],
    teach: "Berlijn is de hoofdstad van Duitsland. München en Hamburg zijn groot, maar niet de hoofdstad.",
  },
];

export const PROVINCE_LIST = PROVINCES;

function uniqueChoices(correct: string, distractors: string[]): string[] {
  const unique = [correct, ...distractors.filter((d) => d !== correct)];
  let n = 1;
  while (unique.length < 4) {
    const extra = `${correct}-${n}`;
    if (!unique.includes(extra)) unique.push(extra);
    n += 1;
  }
  return unique.slice(0, 4);
}

function choice(
  prompt: string,
  correct: string,
  distractors: string[],
  extra?: { hint?: string; visual?: Visual; teach?: string; setup?: string; tag?: string },
): Question {
  const mixed = shuffle(uniqueChoices(correct, distractors));
  return {
    kind: "choice",
    prompt,
    choices: mixed,
    answer: mixed.indexOf(correct),
    ...extra,
  };
}

export function reshuffle(q: Question): Question {
  if (q.kind === "choice") {
    const correct = q.choices[q.answer]!;
    const mixed = shuffle([...q.choices]);
    return { ...q, choices: mixed, answer: mixed.indexOf(correct) };
  }
  if (q.kind === "tiles") return { ...q, tiles: shuffle([...q.tiles]) };
  if (q.kind === "flip") return { ...q, cards: shuffle([...q.cards]) };
  if (q.kind === "pairtap") return { ...q, numbers: shuffle([...q.numbers]) };
  if (q.kind === "sort") return { ...q, items: shuffle([...q.items]) };
  if (q.kind === "order") return { ...q, items: shuffle([...q.items]) };
  if (q.kind === "balance") return { ...q, weights: shuffle([...q.weights]) };
  return q;
}

function mathRange(group: GroupKey, level: number) {
  const g = groupIndex(group);
  const boost = Math.min(4, Math.max(0, level - 1));
  if (g <= 1) return { max: 6 + boost, ops: ["+", "count"] as const };
  if (g === 2) return { max: 12 + boost * 2, ops: ["+", "-"] as const };
  if (g === 3) return { max: 20 + boost * 5, ops: ["+", "-", "×"] as const };
  if (g === 4) return { max: 50 + boost * 10, ops: ["+", "-", "×"] as const };
  if (g === 5) return { max: 100, ops: ["+", "-", "×", "÷"] as const };
  return { max: 200, ops: ["+", "-", "×", "÷"] as const };
}

function numDistractors(ans: number, extras: number[]): string[] {
  const set = new Set<string>([String(ans)]);
  for (const n of extras) {
    if (n !== ans && n >= 0) set.add(String(n));
  }
  let k = 1;
  while (set.size < 4) {
    if (!set.has(String(ans + k))) set.add(String(ans + k));
    if (set.size < 4 && ans - k >= 0 && !set.has(String(ans - k))) set.add(String(ans - k));
    k += 1;
  }
  return [...set].filter((s) => s !== String(ans)).slice(0, 3);
}

function countOn(from: number, steps: number): string {
  const seq = Array.from({ length: steps }, (_, i) => String(from + i + 1));
  return seq.join(", ");
}

function addTeach(a: number, b: number, ans: number): string {
  const big = Math.max(a, b);
  const small = Math.min(a, b);
  if (small === 0) return `${big} plus 0 blijft ${big}. Niets erbij, dus hetzelfde.`;
  if (a === b) return `${a} plus ${b} is twee keer ${a}: ${ans}.`;
  if (small <= 4) {
    return `Begin bij ${big}. Tel ${small} verder: ${countOn(big, small)}. Dat is ${ans}.`;
  }
  if (big < 10 && ans > 10) {
    const toTen = 10 - big;
    return `${big} tot 10 is ${toTen}. Dan nog ${small - toTen} erbij: ${ans}. Eerst naar de tien.`;
  }
  if (big >= 10 && small >= 10) {
    const tens = Math.floor(big / 10) * 10 + Math.floor(small / 10) * 10;
    const ones = (big % 10) + (small % 10);
    return `Tientallen en eenheden: ${tens} + ${ones} = ${ans}.`;
  }
  return `Begin bij het grootste, ${big}. Tel ${small} verder. Je komt op ${ans}.`;
}

function subTeach(a: number, b: number, ans: number): string {
  if (b === 0) return `${a} min 0 blijft ${a}. Niets eraf.`;
  if (a === b) return `${a} min ${a} is 0. Alles weg.`;
  if (b <= 4) {
    const seq = Array.from({ length: b }, (_, i) => String(a - i - 1));
    return `Begin bij ${a}. Tel ${b} terug: ${seq.join(", ")}. Dat is ${ans}.`;
  }
  return `Hoeveel moet je bij ${b} optellen tot ${a}? ${b} + ${ans} = ${a}. Dus ${a} − ${b} = ${ans}.`;
}

function timesTeach(a: number, b: number, ans: number): string {
  if (b <= 1) return `${a} keer 1 is ${a} zelf. Eén groepje.`;
  if (a <= 1) return `1 keer ${b} is ${b} zelf.`;
  if (b <= 5) {
    const parts = Array.from({ length: b }, () => String(a)).join(" + ");
    return `${a} × ${b} is ${b} groepjes van ${a}: ${parts} = ${ans}.`;
  }
  if (a <= 5) {
    const parts = Array.from({ length: a }, () => String(b)).join(" + ");
    return `${a} × ${b} is ${a} groepjes van ${b}: ${parts} = ${ans}.`;
  }
  return `${a} groepen van ${b} is ${ans}. Zeg hardop: ${a} × ${b} = ${ans}.`;
}

function withHint(q: Question, hint: string): Question {
  return q.hint ? q : { ...q, hint };
}

function useStory(beat: Beat, group: GroupKey): boolean {
  if (beat === "boss") return false;
  if (groupIndex(group) < 2) return true;
  return Math.random() < (beat === "warmup" ? 0.7 : 0.4);
}

function rekenpad(group: GroupKey, level: number, beat: Beat): Question {
  const { max, ops } = mathRange(group, level);
  const op = pick(ops);
  const story = useStory(beat, group);
  if (op === "count") {
    const n = between(1, Math.min(8, max));
    return choice("Hoeveel lichtjes zie je?", String(n), numDistractors(n, [n + 1, Math.max(1, n - 1), n + 2]), {
      visual: { type: "dots", count: n },
      teach: n <= 5 ? `Tel rustig, wijs mee: 1 tot ${n}. Er zijn ${n}.` : `Eerst vijf, dan nog ${n - 5}. Samen ${n}.`,
      hint: "Wijs elk lichtje. Tel één keer. Niet twee keer hetzelfde.",
      tag: `tellen tot ${n}`,
    });
  }
  if (op === "×") {
    const a = between(1, 10);
    const b = between(1, groupIndex(group) >= 4 ? 10 : 5);
    const ans = a * b;
    const showGroups = a <= 6 && b <= 6 && a * b <= 24;
    return choice(`${a} × ${b} =`, String(ans), numDistractors(ans, [ans + a, Math.max(0, ans - a), a + b, a * (b + 1)]), {
      setup: story ? `Je hebt ${a} doosjes met ${b} knikkers.` : undefined,
      teach: timesTeach(a, b, ans),
      hint: "Denk in groepjes. Tel niet alles los als je de tafel al kent.",
      tag: `${a} × ${b}`,
      visual: showGroups ? { type: "groups", groups: a, size: b } : undefined,
    });
  }
  if (op === "÷") {
    const b = between(2, 10);
    const qv = between(2, 10);
    const a = b * qv;
    return choice(`${a} ÷ ${b} =`, String(qv), numDistractors(qv, [qv + 1, qv - 1, b, a - b]), {
      setup: story ? `${a} stickers, ${b} in elk bakje. Hoeveel bakjes?` : undefined,
      teach: `${a} delen door ${b} is ${qv}, want ${b} × ${qv} = ${a}. Delen is de tafel achterstevoren.`,
      hint: "Welk getal keer het tweede geeft het eerste?",
      tag: `${a} ÷ ${b}`,
    });
  }
  const a = between(1, max);
  const b = between(1, op === "-" ? a : max);
  const ans = op === "+" ? a + b : a - b;
  const showParts = op === "+" && a <= 10 && b <= 10 && ans <= 14;
  return choice(`${a} ${op} ${b} =`, String(ans), numDistractors(ans, [ans + 1, Math.max(0, ans - 1), op === "+" ? Math.abs(a - b) : a + b]), {
    setup: story
      ? op === "+"
        ? `Je hebt ${a} en krijgt er ${b} bij. Hoeveel nu?`
        : `Je hebt ${a} en geeft er ${b} weg. Hoeveel hou je over?`
      : undefined,
    teach: op === "+" ? addTeach(a, b, ans) : subTeach(a, b, ans),
    hint: op === "+" ? "Begin bij het grootste. Tel het kleine getal verder." : "Tel terug, of vraag: hoeveel erbij tot het eerste getal?",
    tag: `${a} ${op} ${b}`,
    visual: showParts ? { type: "parts", parts: [a, b] } : undefined,
  });
}

function tafeltuin(_group: GroupKey, level: number, beat: Beat): Question {
  const table = Math.min(10, Math.max(1, 1 + ((level - 1) % 10)));
  const n = between(1, beat === "warmup" ? 5 : 10);
  const ans = table * n;
  const mode = beat === "boss" ? 1 : level % 3;
  const row = Array.from({ length: Math.min(n, 6) }, (_, i) => table * (i + 1)).join(", ");
  const teach =
    n <= 5
      ? timesTeach(table, n, ans)
      : `Tafel van ${table}: ${row}${n > 6 ? "…" : ""}. Dus ${table} × ${n} = ${ans}. Zeg hem hardop.`;
  const hint = `Tafel van ${table}. Zeg hem op tot ${n} keer.`;
  const visual = table <= 6 && n <= 6 && ans <= 24 ? ({ type: "groups", groups: n, size: table } as const) : undefined;
  if (mode === 2) {
    return choice(`Hoeveel is ${n} keer de tafel van ${table}?`, String(ans), numDistractors(ans, [table * (n + 1), table * Math.max(1, n - 1), table + n]), {
      teach,
      hint,
      tag: `${table} × ${n}`,
      visual,
    });
  }
  if (mode === 1) {
    return choice(`${ans} hoort bij de tafel van ${table}. Wat ontbreekt? ${table} × ? = ${ans}`, String(n), numDistractors(n, [n + 1, Math.max(1, n - 1), table]), {
      teach: `${table} × ${n} = ${ans}, dus het vraagteken is ${n}. Tafel achterstevoren.`,
      hint: "Welk keer-getal hoort bij dit antwoord?",
      tag: `${table} × ${n}`,
    });
  }
  return choice(`${table} × ${n} =`, String(ans), numDistractors(ans, [table * (n + 1), table * Math.max(1, n - 1), table + n]), {
    teach,
    hint,
    tag: `${table} × ${n}`,
    visual,
  });
}

function letterbos(group: GroupKey, _level: number, _beat: Beat): Question {
  const g = groupIndex(group);
  if (g >= 2 && Math.random() < 0.35) {
    const item = pick(RHYMES);
    return choice(`Welk woord rijmt op “${item.word}”?`, item.rhyme, item.no, {
      teach: `“${item.word}” en “${item.rhyme}” klinken achteraan hetzelfde. Zeg ze achter elkaar.`,
      hint: "Hou de staart van het woord vast. Welke klinkt hetzelfde?",
      tag: `rijm ${item.word}`,
    });
  }
  const entries = Object.entries(WORDS_START);
  const [letter, words] = pick(entries);
  const word = pick(words);
  if (g <= 2 && Math.random() < 0.5) {
    const others = shuffle(LETTERS.filter((l) => l !== letter)).slice(0, 3);
    const mixed = shuffle([letter, ...others]);
    return {
      kind: "choice",
      prompt: `Welke letter hoor je vooraan in “${word}”?`,
      choices: mixed.map((l) => l.toUpperCase()),
      answer: mixed.indexOf(letter),
      teach: `Zeg het langzaam: “${word}”. Mond open, eerste klank: ${letter.toUpperCase()}.`,
      hint: "Zeg het woord in sloooow-mo. Wat komt eerst?",
      tag: `${word}`,
    };
  }
  const distractors = shuffle(entries.filter(([l]) => l !== letter)).slice(0, 3).map(([, w]) => pick(w));
  return choice(`Welk woord begint met ${letter.toUpperCase()}?`, word, distractors, {
    teach: `“${word}” begint met ${letter.toUpperCase()}, de ${letter}-klank. De anderen niet.`,
    hint: "Zeg elk woord. Welke opent met dezelfde klank?",
    tag: `${letter.toUpperCase()} van ${word}`,
    visual: { type: "letter", letter: letter.toUpperCase() },
  });
}

function woordvanger(group: GroupKey, _level: number, _beat: Beat): Question {
  if (groupIndex(group) >= 3 && Math.random() < 0.45) {
    const item = pick(FILL);
    const mixed = shuffle(item.options);
    const filled = item.stem.replace("_", item.answer);
    return {
      kind: "choice",
      prompt: `Welke letters horen in ${item.stem.replace("_", "…")}?`,
      choices: mixed,
      answer: mixed.indexOf(item.answer),
      hint: "Zeg het woord hardop. Rek de klank in het midden.",
      teach: `Het woord is “${filled}”. In het midden hoor je “${item.answer}”. Zeg “${filled}” nog eens.`,
      tag: filled,
    };
  }
  const pool = SPELLING.filter((s) => s.wrong !== s.right);
  const item = pick(pool.length ? pool : SPELLING);
  if (item.wrong === item.right) {
    const other = pick(SPELLING.filter((s) => s.right !== item.right && s.wrong !== s.right));
    return choice("Welk woord is goed gespeld?", item.right, [other.wrong, other.right === other.wrong ? `${other.right}e` : other.wrong, `${item.right}t`].slice(0, 3), {
      hint: `Onthoud: ${item.why}.`,
      teach: `“${item.right}” is goed. Regel: ${item.why}. Zeg het woord, kijk of je de regel hoort.`,
      tag: item.right,
    });
  }
  const others = shuffle(SPELLING.filter((s) => s.right !== item.right)).slice(0, 2).map((s) => s.wrong);
  return choice("Welk woord is goed gespeld?", item.right, [item.wrong, ...others], {
    hint: `Denk aan: ${item.why}.`,
    teach: `Niet “${item.wrong}”, maar “${item.right}”. Regel: ${item.why}. Die onthoud je, niet het foute plaatje.`,
    tag: item.right,
  });
}

function formatTime(h: number, m: number): string {
  const hh = ((h + 11) % 12) + 1;
  if (m === 0) return `${hh} uur`;
  if (m === 15) return `kwart over ${hh}`;
  if (m === 30) return `half ${hh === 12 ? 1 : hh + 1}`;
  if (m === 45) return `kwart voor ${hh === 12 ? 1 : hh + 1}`;
  if (m < 30) return `${m} over ${hh}`;
  return `${60 - m} voor ${hh === 12 ? 1 : hh + 1}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function clockTeach(hours: number, minutes: number): string {
  const spoken = formatTime(hours, minutes);
  if (minutes === 0) return `De grote wijzer op de 12: precies ${spoken}. De kleine wijzer wijst het uur.`;
  if (minutes === 15) return `Kwart over: de grote wijzer wijst naar de 3. Het is ${spoken}.`;
  if (minutes === 30) return `Half: de grote wijzer naar de 6. De kleine wijzer is al onderweg naar het volgende uur. Het is ${spoken}.`;
  if (minutes === 45) return `Kwart voor: de grote wijzer naar de 9. Het is ${spoken}.`;
  if (minutes < 30) return `De grote wijzer telt de minuten: elk cijfer is vijf minuten. Hij staat bij ${minutes / 5}. Het is ${spoken}.`;
  return `Na half tel je terug naar het volgende uur. Het is ${spoken}.`;
}

function clockHint(minutes: number): string {
  if (minutes === 0) return "Grote wijzer op de 12? Dan is het een heel uur.";
  if (minutes === 15) return "Grote wijzer naar de 3 is kwart over.";
  if (minutes === 30) return "Grote wijzer naar de 6 is half. Het volgende uur.";
  if (minutes === 45) return "Grote wijzer naar de 9 is kwart voor.";
  return "Eerst de grote wijzer (minuten), dan de kleine (uur).";
}

function klokkijken(group: GroupKey, level: number, beat: Beat): Question {
  const g = groupIndex(group) + Math.floor(level / 3);
  const hours = between(1, 12);
  let minutes = 0;
  if (beat === "warmup" || g <= 2) minutes = 0;
  else if (g === 3) minutes = pick([0, 30]);
  else if (g === 4) minutes = pick([0, 15, 30, 45]);
  else minutes = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  if (beat === "boss" && g >= 4) minutes = pick([5, 10, 20, 25, 35, 40, 50, 55]);
  const story = useStory(beat, group);
  if (beat !== "warmup") {
    return clockSet(hours, minutes, {
      teach: clockTeach(hours, minutes),
      hint: clockHint(minutes),
      setup: story ? "Sleep de wijzers tot het klopt." : undefined,
    });
  }
  const correct = formatTime(hours, minutes);
  if (g >= 6 && beat !== "warmup" && Math.random() < 0.4) {
    const digital = `${pad2(hours)}:${pad2(minutes)}`;
    const distract: string[] = [];
    while (distract.length < 3) {
      const h2 = between(1, 12);
      const m2 = pick([0, 15, 30, 45, minutes]);
      const t = `${pad2(h2)}:${pad2(m2)}`;
      if (t !== digital && !distract.includes(t)) distract.push(t);
    }
    return choice("Hoe schrijf je deze tijd in cijfers?", digital, distract, {
      visual: { type: "clock", hours, minutes },
      teach: `${correct} schrijf je als ${digital}. Eerst het uur, dan de minuten, altijd twee cijfers.`,
      hint: "Uur links, minuten rechts. 9 uur is 09:00.",
      tag: digital,
      setup: story ? "De bus gaat om deze tijd. Hoe schrijf je dat?" : undefined,
    });
  }
  const distract: string[] = [];
  while (distract.length < 3) {
    const h2 = between(1, 12);
    const m2 = minutes === 0 ? 0 : pick([0, 15, 30, 45, minutes]);
    const t = formatTime(h2, m2);
    if (t !== correct && !distract.includes(t)) distract.push(t);
  }
  return choice("Hoe laat is het?", correct, distract, {
    visual: { type: "clock", hours, minutes },
    teach: clockTeach(hours, minutes),
    hint: clockHint(minutes),
    tag: correct,
    setup: story ? "Kijk naar de klok. Hoe laat moet je weg?" : undefined,
  });
}

const SHAPES: ShapeItem["shape"][] = ["circle", "square", "triangle", "diamond"];
const FILLS: ShapeItem["fill"][] = ["teal", "ink", "clay", "paper"];

function patronen(_group: GroupKey, level: number, beat: Beat): Question {
  const mode = beat === "boss" ? 2 : level % 3;
  if (mode === 0) {
    const a = pick(SHAPES);
    const b = pick(SHAPES.filter((s) => s !== a));
    const items: ShapeItem[] = [
      { shape: a, fill: "teal" },
      { shape: b, fill: "ink" },
      { shape: a, fill: "teal" },
      { shape: b, fill: "ink" },
      { shape: a, fill: "teal" },
    ];
    const next = b;
    const mixed = shuffle([next, a, pick(SHAPES.filter((s) => s !== a && s !== b)), pick(SHAPES.filter((s) => s !== next))]);
    const labels: Record<string, string> = {
      circle: "cirkel",
      square: "vierkant",
      triangle: "driehoek",
      diamond: "ruit",
    };
    const unique = uniqueChoices(labels[next]!, mixed.filter((s) => s !== next).map((s) => labels[s]!));
    const shuffled = shuffle(unique);
    return {
      kind: "choice",
      prompt: "Welke vorm komt hierna?",
      visual: { type: "shapes", items },
      choices: shuffled,
      answer: shuffled.indexOf(labels[next]!),
      teach: `Het patroon wisselt: ${labels[a]}, ${labels[b]}, ${labels[a]}, ${labels[b]}… dus nu ${labels[next]}. Zeg de rij hardop.`,
      hint: "Wijs mee: één, twee, één, twee… wat is de volgende?",
      tag: "vormpatroon",
    };
  }
  if (mode === 1) {
    const a = pick(FILLS);
    const b = pick(FILLS.filter((f) => f !== a));
    const items: ShapeItem[] = [a, a, b, a, a].map((fill) => ({ shape: "circle", fill }));
    const next = b;
    const labels: Record<ShapeItem["fill"], string> = {
      teal: "oranje",
      ink: "donker",
      clay: "bruin",
      paper: "licht",
    };
    const rest = FILLS.filter((f) => f !== next).map((f) => labels[f]);
    return choice("Welke kleur komt hierna?", labels[next], rest, {
      visual: { type: "shapes", items },
      teach: `Twee ${labels[a]}, dan één ${labels[b]}. Het blokje is 2+1. Nu komt ${labels[next]}.`,
      hint: "Tel in groepjes van drie. Wat zou de derde zijn?",
      tag: "kleurpatroon",
    });
  }
  const start = between(2, 5);
  const step = between(1, beat === "boss" ? 4 : 3);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  const next = start + 4 * step;
  return choice(`Wat komt na ${seq.join(", ")}?`, String(next), numDistractors(next, [next + step, next - step, seq[3]! + 1]), {
    teach: `Elke keer +${step}: ${seq.join(" → ")} → ${next}. Het verschil blijft gelijk.`,
    hint: "Trek twee buren van elkaar af. Dat sprongetje herhaalt.",
    tag: `+${step}`,
  });
}

function geheugen(_group: GroupKey, level: number, beat: Beat): Question {
  const size = level >= 6 || beat === "boss" ? 9 : 4;
  const len = Math.min(6, 2 + Math.floor(level / 2) + (beat === "boss" ? 1 : 0));
  return {
    kind: "choice",
    prompt: `Onthoud ${len} stappen`,
    visual: { type: "memory", size },
    choices: [String(len), "0", "0", "0"],
    answer: 0,
    hint: "Zeg de volgorde in je hoofd als een zin. Dan tikken.",
    teach: `Kijk eerst, zeg de volgorde in je hoofd, dan tikken. ${len} stappen. Gokken werkt niet — nazeggen wel.`,
    tag: `${len} stappen`,
  };
}

const REGION: Record<string, string> = {
  groningen: "in het noorden",
  friesland: "in het noorden, aan de Wadden",
  drenthe: "in het noorden, onder Groningen",
  overijssel: "in het oosten",
  flevoland: "in het midden, de nieuwe polder",
  gelderland: "in het midden-oosten",
  utrecht: "in het midden van het land",
  "noord-holland": "in het westen, boven het IJ",
  "zuid-holland": "in het westen, bij de grote steden",
  zeeland: "in het zuidwesten, bij het water",
  "noord-brabant": "in het zuiden",
  limburg: "helemaal in het zuiden, de smalle punt",
};

function topo(group: GroupKey, level: number, beat: Beat): Question {
  const g = groupIndex(group);
  if (g >= 5 && beat !== "warmup" && Math.random() < 0.35) {
    const item = pick(WORLD);
    return choice(item.prompt, item.answer, item.distractors, {
      teach: item.teach,
      hint: "Denk aan de kaart: noord boven, zuid onder, oost rechts, west links.",
      tag: item.answer,
    });
  }
  if (g >= 5 && beat !== "warmup" && Math.random() < 0.35) {
    const c = pick(CITIES);
    const others = shuffle(CITIES.filter((x) => x.province !== c.province)).slice(0, 3).map((x) => x.province);
    return choice(`In welke provincie ligt ${c.city}?`, c.province, others, {
      teach: `${c.city} ligt in ${c.province}. Zeg: “${c.city}, ${c.province}.” Dan plakt de koppeling.`,
      hint: "Denk aan de streek: noord, midden, west of zuid.",
      tag: c.city,
    });
  }
  const p = pick(PROVINCES);
  const where = REGION[p.id] ?? "in Nederland";
  if (level % 2 === 0 || g < 5 || beat === "warmup") {
    const others = shuffle(PROVINCES.filter((x) => x.id !== p.id)).slice(0, 3).map((x) => x.name);
    return choice("Welke provincie is dit?", p.name, others, {
      visual: { type: "map", highlight: p.id },
      teach: `${p.name} ligt ${where}. Hoofdstad: ${p.capital}. Kijk nog eens naar de vorm — die onthoud je.`,
      hint: "Noord is boven. Kijk naar de vorm, niet naar hoe groot hij is.",
      tag: p.name,
    });
  }
  const others = shuffle(PROVINCES.filter((x) => x.id !== p.id)).slice(0, 3).map((x) => x.capital);
  return choice(`Wat is de hoofdstad van ${p.name}?`, p.capital, others, {
    teach: `De hoofdstad van ${p.name} is ${p.capital}. ${p.name} ligt ${where}.`,
    hint: `Denk aan ${p.name}. Welke stad hoort daarbij?`,
    tag: p.capital,
  });
}

export function makeQuestion(gameId: GameId, group: GroupKey, level: number, beat: Beat = "core"): Question {
  let q: Question;
  switch (gameId) {
    case "rekenpad":
      q = rekenpad(group, level, beat);
      break;
    case "tafeltuin":
      q = tafeltuin(group, level, beat);
      break;
    case "letterbos":
      q = letterbos(group, level, beat);
      break;
    case "woordvanger":
      q = woordvanger(group, level, beat);
      break;
    case "klokkijken":
      q = klokkijken(group, level, beat);
      break;
    case "patronen":
      q = patronen(group, level, beat);
      break;
    case "geheugen":
      q = geheugen(group, level, beat);
      break;
    case "topo":
      q = topo(group, level, beat);
      break;
    case "maak10":
      q = maak10(group, level, beat);
      break;
    case "sprong":
      q = sprong(group, level, beat);
      break;
    case "stapel":
      q = stapel(group, level, beat);
      break;
    case "bakken":
      q = bakken(group, level, beat);
      break;
    case "kassa":
      q = kassa(group, level, beat);
      break;
    case "draai":
      q = draai(group, level, beat);
      break;
    case "honderd":
      q = honderd(group, level, beat);
      break;
    case "taart":
      q = taart(group, level, beat);
      break;
    case "kralen":
      q = kralen(group, level, beat);
      break;
    case "rij":
      q = rij(group, level, beat);
      break;
    case "jacht":
      q = jacht(group, level, beat);
      break;
    case "weeg":
      q = weeg(group, level, beat);
      break;
    case "spiegel":
      q = spiegel(group, level, beat);
      break;
    case "zin":
      q = zin(group, level, beat);
      break;
  }
  return withHint(q, defaultHint(gameId));
}

export function nextLevel(level: number, correctStreak: number, missStreak: number): number {
  if (correctStreak >= 5) return Math.min(12, level + 1);
  if (correctStreak >= 3) return Math.min(12, level + 1);
  if (missStreak >= 2) return Math.max(1, level - 1);
  return level;
}
