import type { BadgeWorld } from "./loop.ts";

/** Four layers. Learning is the game — this is proof it stuck. No shop. */
export const REWARD_LAYERS = [
  {
    id: "tik",
    kicker: "Tijdens de ronde",
    title: "Combo",
    body: "Twee goed op rij is voelbaar. Vijf is een medaille. Geen munten, geen winkel.",
  },
  {
    id: "ronde",
    kicker: "Na tien vragen",
    title: "Sterren",
    body: "Eén, twee of drie. Negentig procent is drie. Zestig is twee. De rest is één — je kwam, dat telt.",
  },
  {
    id: "dag",
    kicker: "Vandaag",
    title: "De reeks",
    body: "Eén ronde = de dag zit. De tweede is bonus: dezelfde stof, nog vaster. Ouders zetten de timer.",
  },
  {
    id: "kast",
    kicker: "De kast",
    title: "Medailles",
    body: "Zestien stuks, in de wereld die het kind kiest. Sterren, Kampioen of Bos — dezelfde verdienste, andere naam.",
  },
] as const;

const RANKS: Record<BadgeWorld, string[]> = {
  ster: ["Vonkje", "Glans", "Ster", "Poolster", "Hemel"],
  kampioen: ["Pupil", "Speler", "Kampioen", "Meester", "Legende"],
  bos: ["Spruit", "Kuiken", "Uil", "Wachter", "Woud"],
};

export function rankIndex(level: number): number {
  const n = Math.max(1, Math.floor(level));
  if (n >= 12) return 4;
  if (n >= 8) return 3;
  if (n >= 5) return 2;
  if (n >= 3) return 1;
  return 0;
}

export function rankName(level: number, world: BadgeWorld): string {
  return RANKS[world][rankIndex(level)] ?? RANKS.bos[0]!;
}

export function levelTitle(level: number, world: BadgeWorld): string {
  return `${rankName(level, world)} ${level}`;
}

export function roundMark(world: BadgeWorld): { art: string; one: string; many: string } {
  if (world === "ster") return { art: "/art/badges/ster.jpg", one: "ster", many: "sterren" };
  if (world === "kampioen") return { art: "/art/badges/kroon.jpg", one: "beker", many: "bekers" };
  return { art: "/art/badges/bloesem.jpg", one: "eikel", many: "eikels" };
}

export function questSlots(done: number): { filled: boolean; kind: "dag" | "bonus" }[] {
  const n = Math.min(2, Math.max(0, done));
  return [
    { filled: n >= 1, kind: "dag" },
    { filled: n >= 2, kind: "bonus" },
  ];
}

export function weekFilled(dots: { done: boolean }[]): number {
  return dots.filter((d) => d.done).length;
}
