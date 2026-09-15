import { GAMES } from "./catalog.ts";
import { dayKey } from "./day.ts";
import type { Beat, GameId, PlaySession } from "./types.ts";


/** Consecutive calendar days with at least one play, counting back from today (or yesterday if today is empty). */
export function consecutivePlayDays(sessions: PlaySession[], childId: number, now = new Date()): number {
  const days = new Set(
    sessions
      .filter((s) => s.childId === childId)
      .map((s) => {
        const t = Date.parse(s.createdAt);
        return Number.isFinite(t) ? dayKey(new Date(t)) : s.createdAt.slice(0, 10);
      }),
  );
  if (days.size === 0) return 0;
  let cursor = dayKey(now);
  if (!days.has(cursor)) {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    cursor = dayKey(d);
  }
  let n = 0;
  while (days.has(cursor)) {
    n += 1;
    const d = new Date(`${cursor}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    cursor = d.toISOString().slice(0, 10);
  }
  return n;
}

export function playedToday(sessions: PlaySession[], childId: number, now = new Date()): boolean {
  const today = dayKey(now);
  return sessions.some((s) => {
    if (s.childId !== childId) return false;
    const t = Date.parse(s.createdAt);
    const day = Number.isFinite(t) ? dayKey(new Date(t)) : s.createdAt.slice(0, 10);
    return day === today;
  });
}

export function comebackLine(days: number, today: boolean): string {
  if (days <= 0) return "Eerste ronde. Daarna wil je morgen terug.";
  if (!today) {
    if (days === 1) return "Je speelde gisteren. Eén ronde maakt er twee — dan begint de gewoonte.";
    if (days >= 3) return `${days} dagen op rij staat op het spel. Eén ronde houdt het vast.`;
    return `${days} dagen op rij. Eén ronde houdt het vast.`;
  }
  if (days === 1) return "Dag 1 zit. Morgen weer, dan plakt de gewoonte.";
  if (days >= 5) return `Dag ${days} op rij. Dat is hoe het in je hoofd blijft.`;
  return `Dag ${days} op rij. Nog eentje? Dan blijft het plakken.`;
}

export function comboLine(n: number): string | null {
  if (n < 2) return null;
  if (n === 2) return "2 goed. De reeks begint";
  if (n === 3) return "3 op rij — hou vol";
  if (n === 4) return "4 op rij. Mist ’m niet";
  if (n === 5) return "5 op rij. Je bent warm";
  if (n >= 8) return `${n} op rij. Flow — dit zit`;
  return `${n} goed op rij`;
}

export function beatForIndex(index: number, round = 10): Beat {
  if (index <= 1) return "warmup";
  if (index >= round - 2) return "boss";
  return "core";
}

export function beatLevel(level: number, beat: Beat): number {
  if (beat === "warmup") return Math.max(1, level - 1);
  if (beat === "boss") return Math.min(12, level + 1);
  return level;
}

export function beatLine(beat: Beat, index: number, round = 10): string {
  if (beat === "warmup") return index === 0 ? "Opwarmen. Makkelijk, zodat je erin zit." : "Nog even warm.";
  if (beat === "boss") return index === round - 1 ? "Laatste. Dit is de test." : "Even lastiger. Let op.";
  return "Nu de echte. Denk eerst, tik daarna.";
}

export function hintDelayMs(beat: Beat): number {
  if (beat === "warmup") return 0;
  if (beat === "boss") return 10000;
  return 6000;
}

const TIPS: Record<GameId, string> = {
  rekenpad: "Begin bij het grootste getal. Tel rustig verder — hardop mag.",
  tafeltuin: "Zeg de tafel in je hoofd: 1 keer, 2 keer, 3 keer…",
  letterbos: "Zeg het woord heel langzaam. De eerste klank telt.",
  woordvanger: "Zeg het hardop. Schrijf wat je hoort. Kijk dan naar de regel.",
  klokkijken: "Eerst de grote wijzer. Die telt de minuten.",
  patronen: "Wat herhaalt zich? Dat komt weer.",
  geheugen: "Kijk, zeg de volgorde in je hoofd, dan tikken. Niet gokken.",
  topo: "Noord is boven. Kijk naar de vorm.",
  maak10: "Tik er één. Wat moet erbij tot het doel?",
  sprong: "Tel de streepjes. Elke streep is één sprong.",
  stapel: "Zeg het woord. Dan de letters van links naar rechts.",
  bakken: "Eén regel. Alles wat daarbij hoort, in dezelfde bak.",
  kassa: "Grootste munt die nog past, dan bijpassen.",
  draai: "Draai er één. Zeg het antwoord. Zoek dat.",
  honderd: "Elke rij is tien. Het laatste cijfer is de kolom.",
  taart: "Tel de stukken. Tik er precies zoveel als de breuk zegt.",
  kralen: "Vijf rood, vijf wit. Tik de kraal die het getal is.",
  rij: "Kleinste of eerste eerst. Daarna de volgende.",
  jacht: "Begin bij de eerste letter. Tik alleen buren.",
  weeg: "Rechts moet even zwaar zijn als links. Grootste gewicht eerst.",
  spiegel: "Wat links zit, zit rechts even ver van de stippellijn.",
  zin: "Wie of wat eerst. Daarna de rest van de zin.",
};

export function defaultHint(gameId: GameId): string {
  return TIPS[gameId];
}

export function briefing(
  gameId: GameId,
  level: number,
  name: string,
  priorTags: string[] = [],
): { kicker: string; title: string; body: string; tip: string } {
  const game = GAMES.find((g) => g.id === gameId);
  const prior = [...new Set(priorTags.filter(Boolean))].slice(0, 2);
  const table = Math.min(10, Math.max(1, 1 + ((level - 1) % 10)));
  const recall =
    prior.length > 0
      ? `Vorige keer: ${prior.join(" en ")}. Die komen terug — zo blijft het zitten.`
      : gameId === "tafeltuin"
        ? `Tafel van ${table}. Zeg hem in je hoofd voor je tikt.`
        : (game?.mission ?? "Korte ronde. Daarna klaar.");
  return {
    kicker: game?.title ?? "Spel",
    title: `Klaar, ${name}?`,
    body: `${recall} Tien vragen. De laatste twee zijn lastiger.`,
    tip: TIPS[gameId] ?? "Denk eerst, tik daarna.",
  };
}

function numericContrast(picked: string, correct: string): string | null {
  const pn = Number(picked.replace(",", "."));
  const cn = Number(correct.replace(",", "."));
  if (!Number.isFinite(pn) || !Number.isFinite(cn)) return null;
  const d = pn - cn;
  if (d === 1) return `Bijna — één te veel. Het is ${correct}.`;
  if (d === -1) return `Bijna — één te weinig. Het is ${correct}.`;
  if (d === 10 || d === -10) return `Kijk naar de tientallen. Het is ${correct}, niet ${picked}.`;
  return null;
}

export function feedbackLine(args: {
  ok: boolean;
  teach?: string;
  picked?: string;
  correct?: string;
  wasRetry?: boolean;
  lostStreak?: number;
}): string {
  const { ok, teach, picked, correct, wasRetry, lostStreak } = args;
  if (ok) {
    if (wasRetry) return teach ? `Nu zit hij. ${teach}` : "Nu zit hij. Je herhaalde hem, daarom.";
    return teach ? `Ja. ${teach}` : "Ja. Dat klopt.";
  }
  const streakBreak =
    (lostStreak ?? 0) >= 3 ? `De reeks van ${lostStreak} is stuk. ` : "";
  const contrast =
    picked && correct && picked !== correct ? numericContrast(picked, correct) : null;
  if (contrast) return `${streakBreak}${contrast}${teach ? ` ${teach}` : ""}`.trim();
  if (picked && correct && picked !== correct && teach) {
    return `${streakBreak}Niet “${picked}”. ${teach}`;
  }
  return teach ? `${streakBreak}Kijk. ${teach}` : `${streakBreak}Nog een keer. Dan zit het.`;
}

export function recapLine(tags: string[], correct: number, attempts: number, repaired: number): string {
  const unique = [...new Set(tags.filter(Boolean))].slice(0, 4);
  if (unique.length >= 2) {
    return `Vandaag vastgezet: ${unique.slice(0, 3).join(", ")}${unique.length > 3 ? "…" : ""}. Zeg ze nog één keer hardop.`;
  }
  if (repaired > 0) {
    return `${repaired} ${repaired === 1 ? "fout heb" : "fouten heb"} je daarna goed. Herhalen is hoe het vast komt.`;
  }
  if (attempts > 0 && correct / attempts >= 0.8) return "Dit zit. Morgen een tikkeltje lastiger — dan groeit het.";
  return "Fouten zijn hoe het vast komt te zitten. Morgen dezelfde stof, dan lukt het vaker.";
}

export function nearMissLine(correct: number, attempts: number): string | null {
  if (attempts <= 0) return null;
  const ratio = correct / attempts;
  if (ratio >= 0.8 && ratio < 0.9) {
    return "Nog eentje goed en het waren drie sterren. Morgen haal je hem.";
  }
  if (correct === attempts - 1 && attempts >= 6) {
    return "Op één na alles goed. Die ene komt morgen terug — dan zit hij.";
  }
  return null;
}

export function tomorrowHook(gameId: GameId, level: number): string {
  const game = GAMES.find((g) => g.id === gameId);
  if (gameId === "tafeltuin") {
    const table = Math.min(10, Math.max(1, 1 + (level % 10)));
    return `Morgen: de tafel van ${table}, tot hij vanzelf gaat. Eerste vraag is herhaling van vandaag.`;
  }
  if (gameId === "klokkijken") return "Morgen weer de klok. Dan lees je hem zonder nadenken.";
  if (gameId === "woordvanger") return "Morgen dezelfde lastige woorden. Spelling zit vast door herhalen, niet door één keer goed.";
  if (gameId === "geheugen") return "Morgen één stapje langer. Werkgeheugen groeit als je hem durft te rekken.";
  if (gameId === "maak10") return "Morgen weer twee getallen. Tot je ze ziet zonder te rekenen.";
  if (gameId === "sprong") return "Morgen grotere sprongen. De lijn moet in je hoofd zitten.";
  if (gameId === "stapel") return "Morgen weer bouwen. Spelling zit vast met je vingers, niet alleen met je ogen.";
  if (gameId === "kassa") return "Morgen een ander bedrag. Eerst de grote munt, dan bijpassen.";
  if (gameId === "draai") return "Morgen nieuwe paren. Kijken, zeggen, omdraaien.";
  if (gameId === "bakken") return "Morgen weer sorteren. De regel in je vingers, niet op het blaadje.";
  if (gameId === "honderd") return "Morgen weer het veld. Tot je weet waar een getal woont zonder te tellen.";
  if (gameId === "taart") return "Morgen een andere breuk. Eerst de stukken tellen, dan tikken.";
  if (gameId === "kralen") return "Morgen weer schuiven. Vijf-en-vijf tot je tien ziet.";
  if (gameId === "rij") return "Morgen een nieuwe rij. Kleinste eerst, dan de rest.";
  if (gameId === "jacht") return "Morgen een ander woord in het rooster. Vinger erbij, dan zit hij.";
  if (gameId === "weeg") return "Morgen een ander gewicht. Links is rechts — tot het vanzelf klopt.";
  if (gameId === "spiegel") return "Morgen een nieuwe vorm. De as is de stippellijn.";
  if (gameId === "zin") return "Morgen weer een zin. Wie of wat eerst, dan loopt hij.";
  return `Morgen nog een ronde ${game?.title ?? "spel"}. Korte herhaling wint van lang blokken.`;
}

const LOOP_PREFIX = "lumi.loop.";

export interface LoopMemory {
  tags: string[];
  level: number;
  day: string;
}

export function loopKey(childId: number, gameId: GameId): string {
  return `${LOOP_PREFIX}${childId}.${gameId}`;
}

export function saveLoop(childId: number, gameId: GameId, tags: string[], level: number, now = new Date()): void {
  if (typeof window === "undefined") return;
  const payload: LoopMemory = { tags: [...new Set(tags.filter(Boolean))].slice(0, 6), level, day: dayKey(now) };
  try {
    window.localStorage.setItem(loopKey(childId, gameId), JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadLoop(childId: number, gameId: GameId): LoopMemory | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(loopKey(childId, gameId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LoopMemory;
    if (!parsed || !Array.isArray(parsed.tags)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function continueLine(index: number, round: number, ok: boolean): string {
  const left = round - index - 1;
  if (!ok) return "Ik snap het";
  if (left === 1) return "De laatste";
  if (left === 2) return "Nog twee. Let op";
  return "Verder";
}
