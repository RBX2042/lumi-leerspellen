import type { ChildProgress, Skill } from "./types";
import { dayKey, shiftDay } from "./day.ts";

export type BadgeId =
  | "eerste"
  | "perfect"
  | "combo5"
  | "combo8"
  | "dagen3"
  | "dagen7"
  | "sterren3"
  | "meester"
  | "ontdekker"
  | "groei";

export interface BadgeDef {
  id: BadgeId;
  title: string;
  how: string;
}

export const BADGES: BadgeDef[] = [
  { id: "eerste", title: "Eerste ronde", how: "Je eerste ronde is binnen." },
  { id: "perfect", title: "Alles goed", how: "Een ronde zonder misser." },
  { id: "combo5", title: "Vijf op rij", how: "Vijf antwoorden achter elkaar." },
  { id: "combo8", title: "In de flow", how: "Acht goed op rij." },
  { id: "dagen3", title: "Gewoonte", how: "Drie dagen achter elkaar." },
  { id: "dagen7", title: "Een week", how: "Zeven dagen op rij." },
  { id: "sterren3", title: "Drie sterren", how: "Negentig procent of meer." },
  { id: "meester", title: "Het zit vast", how: "Zeventig procent vast in een spel." },
  { id: "ontdekker", title: "Ontdekker", how: "Vier verschillende spellen." },
  { id: "groei", title: "Niveau vijf", how: "Kindniveau 5 bereikt." },
];

export const BADGE_BY_ID: Record<BadgeId, BadgeDef> = Object.fromEntries(
  BADGES.map((b) => [b.id, b]),
) as Record<BadgeId, BadgeDef>;

export interface LevelInfo {
  level: number;
  xp: number;
  into: number;
  need: number;
  pct: number;
}

const HABIT_PREFIX = "lumi.habit.";

export interface HabitSave {
  bestCombo: number;
  seenBadges: BadgeId[];
}

export function todayKey(now = new Date()): string {
  return dayKey(now);
}

function utcDay(iso: string): string {
  return iso.slice(0, 10);
}

/** XP needed to finish level `n` and reach n+1. Level 1→2 is cheap on purpose. */
export function xpCost(level: number): number {
  return 40 + 20 * Math.max(0, level - 1);
}

export function xpToReach(level: number): number {
  if (level <= 1) return 0;
  let t = 0;
  for (let i = 1; i < level; i++) t += xpCost(i);
  return t;
}

export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp));
  let level = 1;
  while (xpToReach(level + 1) <= safe && level < 99) level += 1;
  const floor = xpToReach(level);
  const need = xpCost(level);
  const into = Math.min(need, safe - floor);
  return { level, xp: safe, into, need, pct: need <= 0 ? 100 : Math.round((into / need) * 100) };
}

export function xpForHit(comboAfter: number): number {
  if (comboAfter < 1) return 0;
  if (comboAfter >= 5) return 18;
  return 8 + comboAfter * 2;
}

export function roundXp(correct: number, attempts: number, bestCombo: number): number {
  const base = Math.max(0, correct) * 10;
  const combo = bestCombo >= 3 ? (bestCombo - 2) * 5 : 0;
  const perfect = attempts >= 8 && correct === attempts ? 25 : 0;
  return base + combo + perfect;
}

export function streakFromDays(days: string[], now = new Date()): number {
  const set = new Set(days.map((d) => d.slice(0, 10)));
  if (set.size === 0) return 0;
  let cursor = dayKey(now);
  if (!set.has(cursor)) cursor = shiftDay(cursor, -1);
  let n = 0;
  while (set.has(cursor)) {
    n += 1;
    cursor = shiftDay(cursor, -1);
  }
  return n;
}

export function playedOn(days: string[], now = new Date()): boolean {
  return days.some((d) => d.slice(0, 10) === dayKey(now));
}

export interface WeekDot {
  key: string;
  label: string;
  done: boolean;
  today: boolean;
}

const DOW = ["M", "D", "W", "D", "V", "Z", "Z"];

/** Monday–Sunday of the current local week. */
export function weekDots(days: string[], now = new Date()): WeekDot[] {
  const set = new Set(days.map((d) => d.slice(0, 10)));
  const today = dayKey(now);
  const noon = new Date(`${today}T12:00:00Z`);
  const dow = (noon.getUTCDay() + 6) % 7;
  const monday = shiftDay(today, -dow);
  return DOW.map((label, i) => {
    const key = shiftDay(monday, i);
    return { key, label, done: set.has(key), today: key === today };
  });
}

export interface BadgeInput {
  plays: number;
  perfects: number;
  bestCombo: number;
  streakDays: number;
  threeStars: boolean;
  masteryHigh: boolean;
  gamesPlayed: number;
  level: number;
}

export function earnedBadges(input: BadgeInput): BadgeId[] {
  const out: BadgeId[] = [];
  if (input.plays >= 1) out.push("eerste");
  if (input.perfects >= 1) out.push("perfect");
  if (input.bestCombo >= 5) out.push("combo5");
  if (input.bestCombo >= 8) out.push("combo8");
  if (input.streakDays >= 3) out.push("dagen3");
  if (input.streakDays >= 7) out.push("dagen7");
  if (input.threeStars) out.push("sterren3");
  if (input.masteryHigh) out.push("meester");
  if (input.gamesPlayed >= 4) out.push("ontdekker");
  if (input.level >= 5) out.push("groei");
  return out;
}

export function badgesFromProgress(
  progress: ChildProgress | undefined,
  skills: Skill[] | undefined,
  extra?: { bestCombo?: number; threeStars?: boolean },
): BadgeId[] {
  const p = progress ?? { xp: 0, plays: 0, perfects: 0, gamesPlayed: 0, days: [] };
  const bestSkillCombo = Math.max(0, ...(skills ?? []).map((s) => s.bestStreak));
  return earnedBadges({
    plays: p.plays,
    perfects: p.perfects,
    bestCombo: Math.max(bestSkillCombo, extra?.bestCombo ?? 0),
    streakDays: streakFromDays(p.days),
    threeStars: extra?.threeStars ?? (p.perfects >= 1 || (skills ?? []).some((s) => s.mastery >= 90)),
    masteryHigh: (skills ?? []).some((s) => s.mastery >= 70),
    gamesPlayed: p.gamesPlayed,
    level: levelFromXp(p.xp).level,
  });
}

export function newBadges(before: BadgeId[], after: BadgeId[]): BadgeId[] {
  const have = new Set(before);
  return after.filter((id) => !have.has(id));
}

export function emptyProgress(): ChildProgress {
  return { xp: 0, plays: 0, perfects: 0, gamesPlayed: 0, days: [] };
}

export function daysFromSessions(createdAt: string[]): string[] {
  return [...new Set(createdAt.map(utcDay))];
}

export function loadHabit(childId: number): HabitSave {
  if (typeof window === "undefined") return { bestCombo: 0, seenBadges: [] };
  try {
    const raw = window.localStorage.getItem(HABIT_PREFIX + childId);
    if (!raw) return { bestCombo: 0, seenBadges: [] };
    const parsed = JSON.parse(raw) as HabitSave;
    return {
      bestCombo: typeof parsed.bestCombo === "number" ? parsed.bestCombo : 0,
      seenBadges: Array.isArray(parsed.seenBadges) ? parsed.seenBadges : [],
    };
  } catch {
    return { bestCombo: 0, seenBadges: [] };
  }
}

export function saveHabit(childId: number, habit: HabitSave): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HABIT_PREFIX + childId, JSON.stringify(habit));
  } catch {
    /* ignore */
  }
}

export function dailyQuest(todayPlays: number): { goal: number; done: number; line: string; bonus: boolean } {
  const done = Math.min(2, Math.max(0, todayPlays));
  if (done === 0) return { goal: 1, done: 0, line: "Eén ronde vandaag. Daarna plakt de gewoonte.", bonus: false };
  if (done === 1) return { goal: 2, done: 1, line: "Opdracht klaar. Nog eentje? Dan zit het nóg vaster.", bonus: true };
  return { goal: 2, done: 2, line: "Twee rondes. Morgen dezelfde stof — zo blijft het zitten.", bonus: false };
}

export function starTrackLine(correct: number, attempts: number, left: number): string | null {
  if (attempts < 4 || left <= 0) return null;
  const misses = attempts - correct;
  if (misses === 0 && left <= 3) return `${left === 1 ? "Laatste" : `Nog ${left}`}. Alles goed tot nu — hou de reeks.`;
  if (misses === 1 && left <= 2) return "Op één na alles goed. Deze nog, dan twee sterren vast.";
  if (misses === 0 && attempts >= 5) return "Reeks loopt. Drie sterren zijn dichtbij.";
  return null;
}

export function continueHook(stars: number, leveled: boolean, streakDays: number, todayAlready: boolean): string {
  if (leveled) return "Niveau omhoog. Nog een ronde zet het vast.";
  if (stars >= 3) return "Drie sterren. Kun je het nóg een keer?";
  if (stars === 2) return "Twee sterren. Nog een ronde, dan pak je de derde.";
  if (!todayAlready && streakDays >= 2) return `${streakDays + 1} dagen op rij als je nu stopt? Nee: nog eentje, dan is de dag binnen.`;
  return "Korte ronde. Daarna klaar — of nog eentje.";
}

export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
