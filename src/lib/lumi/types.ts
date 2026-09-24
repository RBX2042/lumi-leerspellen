export type PlanId = "free" | "trial" | "gezin" | "plus" | "school";

export type GroupKey =
  | "groep1"
  | "groep2"
  | "groep3"
  | "groep4"
  | "groep5"
  | "groep6"
  | "groep7"
  | "groep8";

export const GAME_ID_LIST = [
  "rekenpad",
  "tafeltuin",
  "letterbos",
  "woordvanger",
  "klokkijken",
  "patronen",
  "geheugen",
  "topo",
  "maak10",
  "sprong",
  "stapel",
  "bakken",
  "kassa",
  "draai",
  "honderd",
  "taart",
  "kralen",
  "rij",
  "jacht",
  "weeg",
  "spiegel",
  "zin",
  "regen",
  "ballon",
  "sprint",
  "vraagbaas",
  "klopt",
  "opdracht",
  "huiswerk",
] as const;

export type GameId = (typeof GAME_ID_LIST)[number];

export type AvatarId = "uil" | "vos" | "beer" | "haas" | "hert" | "egel" | "ster" | "leeuw";

export type Beat = "warmup" | "core" | "boss";

export interface Child {
  id: number;
  userId: string;
  name: string;
  age: number;
  groupKey: GroupKey;
  avatar: AvatarId;
  dailyMinutes: number;
  createdAt: string;
}

export interface Subscription {
  userId: string;
  plan: PlanId;
  status: string;
  trialEndsAt: string | null;
  periodEnd: string | null;
  billing: "month" | "year";
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
  trialUsed: boolean;
}

export interface Skill {
  gameId: GameId;
  level: number;
  mastery: number;
  correct: number;
  attempts: number;
  streak: number;
  bestStreak: number;
}

export interface PlaySession {
  id: number;
  childId: number;
  gameId: GameId;
  score: number;
  correct: number;
  attempts: number;
  xp: number;
  durationSec: number;
  createdAt: string;
}

export interface DailyUse {
  day: string;
  plays: number;
  minutes: number;
}

export interface Entitlement {
  plan: PlanId;
  premium: boolean;
  plusMode: boolean;
  maxChildren: number;
  dailyPlays: number | null;
  games: GameId[];
  trialDaysLeft: number | null;
  label: string;
}

export interface ChildProgress {
  xp: number;
  plays: number;
  perfects: number;
  gamesPlayed: number;
  days: string[];
}

export interface FamilySnapshot {
  children: Child[];
  subscription: Subscription;
  entitlement: Entitlement;
  skills: Record<number, Skill[]>;
  recent: PlaySession[];
  today: Record<number, DailyUse>;
  weekMinutes: Record<number, number>;
  progress: Record<number, ChildProgress>;
  referralCode: string;
  referralCount: number;
  hasPin: boolean;
}

interface QuestionBase {
  prompt: string;
  setup?: string;
  teach?: string;
  tag?: string;
  hint?: string;
  visual?: Visual;
}

export interface ChoiceQuestion extends QuestionBase {
  kind: "choice";
  choices: string[];
  answer: number;
}

export interface TapQuestion extends QuestionBase {
  kind: "tap";
  options: string[];
  answer: string;
}

export interface LineQuestion extends QuestionBase {
  kind: "line";
  min: number;
  max: number;
  step: number;
  answer: number;
  from?: number;
}

export interface TilesQuestion extends QuestionBase {
  kind: "tiles";
  word: string;
  tiles: string[];
}

export interface ClockSetQuestion extends QuestionBase {
  kind: "clockset";
  hours: number;
  minutes: number;
}

export interface SortQuestion extends QuestionBase {
  kind: "sort";
  left: { label: string; key: string };
  right: { label: string; key: string };
  items: { id: string; label: string; bucket: string }[];
}

export interface PairTapQuestion extends QuestionBase {
  kind: "pairtap";
  target: number;
  numbers: number[];
}

export interface CoinsQuestion extends QuestionBase {
  kind: "coins";
  target: number;
  denominations: number[];
}

export interface FlipQuestion extends QuestionBase {
  kind: "flip";
  cards: { id: string; face: string; pair: string }[];
}

export interface GridQuestion extends QuestionBase {
  kind: "grid";
  cols: number;
  cells: number[];
  answer: number;
}

export interface PieQuestion extends QuestionBase {
  kind: "pie";
  slices: number;
  need: number;
}

export interface BeadsQuestion extends QuestionBase {
  kind: "beads";
  target: number;
  rows: 1 | 2;
}

export interface OrderQuestion extends QuestionBase {
  kind: "order";
  items: { id: string; label: string }[];
  answer: string[];
}

export interface PathQuestion extends QuestionBase {
  kind: "path";
  cols: number;
  letters: string[];
  word: string;
}

export interface BalanceQuestion extends QuestionBase {
  kind: "balance";
  left: number;
  weights: number[];
}

export interface MirrorQuestion extends QuestionBase {
  kind: "mirror";
  cols: number;
  rows: number;
  target: boolean[];
}

export interface CatchQuestion extends QuestionBase {
  kind: "catch";
  target: number;
  fallers: number[];
  seconds: number;
}

export interface FloatQuestion extends QuestionBase {
  kind: "float";
  target: string;
  floaters: string[];
  seconds: number;
}

export interface DashQuestion extends QuestionBase {
  kind: "dash";
  goal: string;
  chips: { label: string; ok: boolean }[];
  seconds: number;
}

export type Question =
  | ChoiceQuestion
  | TapQuestion
  | LineQuestion
  | TilesQuestion
  | ClockSetQuestion
  | SortQuestion
  | PairTapQuestion
  | CoinsQuestion
  | FlipQuestion
  | GridQuestion
  | PieQuestion
  | BeadsQuestion
  | OrderQuestion
  | PathQuestion
  | BalanceQuestion
  | MirrorQuestion
  | CatchQuestion
  | FloatQuestion
  | DashQuestion;

export type Visual =
  | { type: "dots"; count: number }
  | { type: "parts"; parts: number[] }
  | { type: "groups"; groups: number; size: number }
  | { type: "letter"; letter: string; word?: string }
  | { type: "clock"; hours: number; minutes: number }
  | { type: "shapes"; items: ShapeItem[] }
  | { type: "memory"; size: number }
  | { type: "map"; highlight?: string };

export interface ShapeItem {
  shape: "circle" | "square" | "triangle" | "diamond";
  fill: "teal" | "ink" | "clay" | "paper";
}

export const GROUPS: { key: GroupKey; label: string; ages: string }[] = [
  { key: "groep1", label: "Groep 1", ages: "4–5" },
  { key: "groep2", label: "Groep 2", ages: "5–6" },
  { key: "groep3", label: "Groep 3", ages: "6–7" },
  { key: "groep4", label: "Groep 4", ages: "7–8" },
  { key: "groep5", label: "Groep 5", ages: "8–9" },
  { key: "groep6", label: "Groep 6", ages: "9–10" },
  { key: "groep7", label: "Groep 7", ages: "10–11" },
  { key: "groep8", label: "Groep 8", ages: "11–12" },
];

export const AVATARS: { id: AvatarId; label: string }[] = [
  { id: "uil", label: "Uil" },
  { id: "vos", label: "Vos" },
  { id: "beer", label: "Beer" },
  { id: "haas", label: "Haas" },
  { id: "hert", label: "Hert" },
  { id: "egel", label: "Egel" },
  { id: "ster", label: "Ster" },
  { id: "leeuw", label: "Leeuw" },
];

export function groupFromAge(age: number): GroupKey {
  if (age <= 4) return "groep1";
  if (age === 5) return "groep2";
  if (age === 6) return "groep3";
  if (age === 7) return "groep4";
  if (age === 8) return "groep5";
  if (age === 9) return "groep6";
  if (age === 10) return "groep7";
  return "groep8";
}

export function groupIndex(key: GroupKey): number {
  return GROUPS.findIndex((g) => g.key === key);
}
