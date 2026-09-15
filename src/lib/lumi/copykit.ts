import { BRAND, PRICE, euro } from "./brand";

export const COPY = {
  name: BRAND.name,
  tagline: BRAND.tagline,
  claim: BRAND.claim,
  pronunciation: BRAND.pronunciation,
  bio: `${BRAND.name} — ${BRAND.tagline}. Leerspellen voor groep 1 tot 8. Geen reclame, geen chat, één gezinsabonnement.`,
  whatsappOuder: `Hoi, wij oefenen tafels en spelling met ${BRAND.name}. Korte rondes, geen reclame, tot vier kinderen voor ${euro(PRICE.gezin)} per maand. 7 dagen gratis:`,
  whatsappJuf: `Hoi, ken je ${BRAND.name}? Leerspellen voor rekenen, spelling, klokkijken en topo — op de Nederlandse kerndoelen. School is ${euro(PRICE.school)} per klas per maand, tot 30 leerlingen. 7 dagen proef, geen reclame. Link:`,
  facebook: `Op zoek naar schermtijd die wél iets doet?\n\n${BRAND.name} is een Nederlandse leerapp voor groep 1–8: tafels, spelling, klokkijken, topo. Geen reclame, geen beloningswinkel, opzeggen in één tik.\n\nGezin is ${euro(PRICE.gezin)} voor tot vier kinderen — niet per kind. 7 dagen gratis.`,
  emailJufSubject: `${BRAND.name} voor jouw klas — 7 dagen proef`,
  emailJuf: `Beste groepsleerkracht,

Ik stuur ${BRAND.name} even langs: korte leerspellen voor rekenen, spelling, klokkijken en topografie, afgestemd op groep 1 tot 8.

Geen reclame, geen chat, geen accounts voor kinderen. Jij ziet de voortgang per leerling. School is ${euro(PRICE.school)} per maand voor tot 30 leerlingen. Ouders kunnen thuis dooroefenen.

Wil je een proef van 7 dagen? Maak een account, kies School, klaar.

Hartelijke groet`,
  instagram: `${BRAND.name} · ${BRAND.tagline}\nLeerspellen groep 1–8\nGeen reclame · één gezinsprijs`,
} as const;

export function inviteText(origin: string, code?: string): string {
  const url = code ? `${origin}/login?next=/ouders&ref=${encodeURIComponent(code)}` : origin;
  return `${COPY.whatsappOuder} ${url}`;
}

export function teacherText(origin: string): string {
  return `${COPY.whatsappJuf} ${origin}/school`;
}
