import { ALL_GAMES, FREE_GAMES, GAME_COUNT } from "./catalog";
import { NEEDED, PRICE, TARGET_MRR } from "./brand";
import type { Entitlement, GameId, PlanId, Subscription } from "./types";

export { NEEDED, PRICE, TARGET_MRR };

export const PLANS: {
  id: PlanId;
  name: string;
  priceMonth: number;
  priceYear: number;
  tagline: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}[] = [
  {
    id: "free",
    name: "Ontdekker",
    priceMonth: 0,
    priceYear: 0,
    tagline: "Proeven of het klikt",
    features: [
      "1 kindprofiel",
      "3 spellen per dag",
      "Rekenpad, Letterbos, Geheugenpad, Maaktien en Honderdveld",
      "Geen reclame",
    ],
    cta: "Gratis starten",
  },
  {
    id: "gezin",
    name: "Gezin",
    priceMonth: PRICE.gezin,
    priceYear: PRICE.gezinYear,
    tagline: "Tot 4 kinderen. Eén prijs.",
    features: [
      "Tot 4 kinderen op 1 abonnement",
      `Alle ${GAME_COUNT} leerspellen, onbeperkt`,
      "Ouderinzicht en schermtijd",
      "Opzeggen in één tik, geen addertjes",
    ],
    cta: "7 dagen gratis",
    highlight: true,
  },
  {
    id: "plus",
    name: "Plus",
    priceMonth: PRICE.plus,
    priceYear: PRICE.plusYear,
    tagline: "Voor wie extra sturing wil",
    features: [
      "Alles van Gezin",
      "Wekelijks ouderrapport",
      "Persoonlijk leerpad per kind",
      "Zwakke vaardigheden eerst",
    ],
    cta: "Kies Plus",
  },
];

export const SCHOOL_PLAN = {
  id: "school" as const,
  name: "School",
  priceMonth: PRICE.school,
  priceYear: PRICE.schoolYear,
  tagline: "Eén klas, alle spellen, tot 30 leerlingen.",
  features: [
    "Tot 30 kindprofielen",
    "Alle spellen, geen reclame",
    "Voortgang per leerling",
    "Thuisoefenen via ouderlink",
  ],
  cta: "Activeer School",
};

export function entitlementOf(sub: Subscription | null): Entitlement {
  const now = Date.now();
  const trialActive =
    sub?.plan === "trial" &&
    !!sub.trialEndsAt &&
    new Date(sub.trialEndsAt).getTime() > now;
  const paid = sub?.plan === "gezin" || sub?.plan === "plus" || sub?.plan === "school";
  const premium = paid || trialActive;
  const plan: PlanId = premium ? (trialActive ? "trial" : (sub?.plan ?? "free")) : "free";
  const trialDaysLeft = trialActive
    ? Math.max(
        0,
        Math.ceil((new Date(sub!.trialEndsAt!).getTime() - now) / 86_400_000),
      )
    : null;

  return {
    plan,
    premium,
    maxChildren: plan === "school" ? 30 : premium ? 4 : 1,
    dailyPlays: premium ? null : 3,
    games: premium ? ALL_GAMES : FREE_GAMES,
    trialDaysLeft,
    label: trialActive
      ? `Proef · ${trialDaysLeft} dagen`
      : plan === "gezin"
        ? "Gezin"
        : plan === "plus"
          ? "Plus"
          : plan === "school"
            ? "School"
            : "Ontdekker",
  };
}

export function canPlayGame(ent: Entitlement, gameId: GameId): boolean {
  return ent.games.includes(gameId);
}

export const FAMILIES_FOR_TARGET = NEEDED.gezinnen;
