export const BRAND = {
  name: "Lumi",
  tagline: "Leren dat blijft zitten",
  slogan: "Niet nappraten. Vooruitdenken.",
  claim: "Schermtijd waar een kind écht van leert — en de baas blijft.",
  line: "Rekenen. Taal. AI-wijs.",
  category: "Leerspellen voor groep 1 tot 8",
  pronunciation: "LOE-mie",
  domainHint: "lumi",
} as const;

export const PALETTE = [
  { name: "Terracotta", hex: "#C45C38", role: "Accent — knoppen, icoon, één pigment" },
  { name: "Inkt", hex: "#1C1915", role: "Tekst en donkere vlakken" },
  { name: "Papier", hex: "#F6F1E8", role: "Achtergrond, als een blad" },
  { name: "Porselein", hex: "#FFFCF8", role: "Kaarten en velden" },
] as const;

export const TARGET_MRR = 2000;
export const PRICE = {
  gezin: 9.99,
  plus: 14.99,
  school: 49,
  gezinYear: 79,
  plusYear: 119,
  schoolYear: 449,
} as const;

export const NEEDED = {
  gezinnen: Math.ceil(TARGET_MRR / PRICE.gezin),
  klassen: Math.ceil(TARGET_MRR / PRICE.school),
  mixKlassen: 10,
  mixGezinnen: Math.ceil((TARGET_MRR - 10 * PRICE.school) / PRICE.gezin),
} as const;

export function euro(n: number): string {
  return n.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
