import { BRAND, PRICE, euro } from "./brand";

export const COPY = {
  name: BRAND.name,
  tagline: BRAND.tagline,
  slogan: BRAND.slogan,
  claim: BRAND.claim,
  line: BRAND.line,
  pronunciation: BRAND.pronunciation,
  bio: `${BRAND.name} — ${BRAND.slogan} ${BRAND.tagline}. Leerspellen voor groep 1 tot 8, plus AI-wijs: checken en duidelijk vragen. Geen reclame, geen chatbot, één gezinsabonnement.`,
  whatsappOuder: `Hoi, wij oefenen tafels, spelling én AI-wijs met ${BRAND.name}. ${BRAND.slogan} Korte rondes, geen chatbot, tot vier kinderen voor ${euro(PRICE.gezin)} per maand. 30 dagen gratis, alle spellen op Plus:`,
  whatsappJuf: `Hoi, ken je ${BRAND.name}? Leerspellen voor rekenen, spelling, klokkijken, topo én AI-wijs — op de Nederlandse kerndoelen. ${BRAND.slogan} School is ${euro(PRICE.school)} per klas per maand, tot 30 leerlingen. 30 dagen proef op Plus-niveau, geen reclame, geen chatbot. Link:`,
  facebook: `${BRAND.slogan}\n\n${BRAND.name} is een Nederlandse leerapp voor groep 1–8: tafels, spelling, klokkijken, topo — en AI-wijs. Kinderen leren een helper een duidelijke opdracht geven en checken of het klopt. Geen chatbot, geen reclame.\n\nGezin is ${euro(PRICE.gezin)} voor tot vier kinderen — niet per kind. 30 dagen gratis, alle spellen op Plus.`,
  emailJufSubject: `${BRAND.name} voor jouw klas — ${BRAND.slogan}`,
  emailJuf: `Beste groepsleerkracht,

Ik stuur ${BRAND.name} even langs: korte leerspellen voor rekenen, spelling, klokkijken, topografie én AI-wijs, afgestemd op groep 1 tot 8.

${BRAND.slogan}

Geen chatbot in de klas, geen reclame, geen accounts voor kinderen. Wel de gewoonte om te checken en een machine een duidelijke opdracht te geven. Jij ziet de voortgang per leerling. School is ${euro(PRICE.school)} per maand voor tot 30 leerlingen. Ouders kunnen thuis dooroefenen.

Wil je een proef van 30 dagen op Plus-niveau? Maak een account, kies School, klaar.

Hartelijke groet`,
  instagram: `${BRAND.name} · ${BRAND.slogan}\n${BRAND.tagline}\n${BRAND.line}\nGeen chatbot · één gezinsprijs`,
} as const;

export function inviteText(origin: string, code?: string): string {
  const url = code ? `${origin}/login?next=/ouders&ref=${encodeURIComponent(code)}` : origin;
  return `${COPY.whatsappOuder} ${url}`;
}

export function teacherText(origin: string): string {
  return `${COPY.whatsappJuf} ${origin}/school`;
}
