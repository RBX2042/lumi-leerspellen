import type { GameId } from "./types.ts";

export type GameTone = "rekenen" | "taal" | "denken" | "wereld";

export interface GameMeta {
  id: GameId;
  title: string;
  subject: string;
  tone: GameTone;
  blurb: string;
  learns: string;
  mission: string;
  minutes: string;
  ages: string;
  free: boolean;
  kerndoel: string;
}

export const TONE_BAR: Record<GameTone, string> = {
  rekenen: "bg-tone-rekenen",
  taal: "bg-tone-taal",
  denken: "bg-tone-denken",
  wereld: "bg-tone-wereld",
};

export const TONE_TEXT: Record<GameTone, string> = {
  rekenen: "text-tone-rekenen",
  taal: "text-tone-taal",
  denken: "text-tone-denken",
  wereld: "text-tone-wereld",
};

export const GAMES: GameMeta[] = [
  { id: "rekenpad", title: "Rekenpad", subject: "Rekenen", tone: "rekenen", blurb: "Eerst warm, dan écht, dan een test. Elke som legt uit hoe je hem doet.", learns: "Getalbegrip en bewerkingen", mission: "Reken tot het vanzelf gaat", minutes: "8–12 min", ages: "4–12", free: true, kerndoel: "Kerndoelen rekenen 1–5" },
  { id: "tafeltuin", title: "Tafeltuin", subject: "Rekenen", tone: "rekenen", blurb: "De tafels van 1 tot 10. Zeg ze, zie de groepjes, tot ze vastzitten.", learns: "Tafels automatiseren", mission: "Vang de tafels tot ze vastzitten", minutes: "6–10 min", ages: "6–12", free: false, kerndoel: "Kerndoel rekenen 4" },
  { id: "letterbos", title: "Letterbos", subject: "Taal", tone: "taal", blurb: "Letters, klanken en eerste woordjes. Zeg ze langzaam, dan hoor je ze.", learns: "Klank-tekenkoppeling", mission: "Hoor de letter vooraan in het woord", minutes: "6–10 min", ages: "4–7", free: true, kerndoel: "Kerndoelen Nederlands 4–5" },
  { id: "woordvanger", title: "Woordvanger", subject: "Taal", tone: "taal", blurb: "Spelling die kinderen écht fout doen: ei/ij, d/t, open en gesloten. De regel blijft hangen.", learns: "Spelling en woordbeeld", mission: "Vang de woorden die je vaak fout doet", minutes: "8–12 min", ages: "6–12", free: false, kerndoel: "Kerndoel Nederlands 8" },
  { id: "klokkijken", title: "Klokkijken", subject: "Rekenen", tone: "rekenen", blurb: "Hele uren, half, kwartier en vijf minuten — de grote wijzer telt, de kleine wijst.", learns: "Tijd aflezen", mission: "Lees de wijzers zonder te gokken", minutes: "6–10 min", ages: "6–10", free: false, kerndoel: "Kerndoel rekenen 11" },
  { id: "patronen", title: "Patronen", subject: "Logica", tone: "denken", blurb: "Wat komt hierna? Zeg de rij hardop. Dan zie je de sprong.", learns: "Patronen en redeneren", mission: "Zie wat hierna komt", minutes: "6–10 min", ages: "4–12", free: false, kerndoel: "Kerndoel rekenen 23" },
  { id: "geheugen", title: "Geheugenpad", subject: "Brein", tone: "denken", blurb: "Kijk, zeg, tik. Werkgeheugen is de basis onder rekenen en lezen.", learns: "Werkgeheugen", mission: "Onthoud de volgorde, tik hem na", minutes: "5–8 min", ages: "5–12", free: true, kerndoel: "Executieve functies" },
  { id: "topo", title: "TopoReis", subject: "Wereld", tone: "wereld", blurb: "Provincies van Nederland, hoofdsteden en buurlanden. De vorm onthoudt je, niet de sticker.", learns: "Topografie Nederland", mission: "Ken de provincies als je eigen straat", minutes: "8–12 min", ages: "8–12", free: false, kerndoel: "Kerndoel oriëntatie 50" },
  { id: "maak10", title: "Maaktien", subject: "Rekenen", tone: "rekenen", blurb: "Tik twee getallen die samen tien zijn. Snel, kort, verslavend — en het blijft zitten.", learns: "Getalcombinaties tot 20", mission: "Vind het paar dat samenklopt", minutes: "5–8 min", ages: "4–10", free: true, kerndoel: "Kerndoel rekenen 1–4" },
  { id: "sprong", title: "Getallensprong", subject: "Rekenen", tone: "rekenen", blurb: "Zet de steen op de lijn. Spring met sprongen van 1, 2, 5 of 10. Zo voel je de getallen.", learns: "Getallenlijn en sprongen", mission: "Land precies op het getal", minutes: "5–8 min", ages: "4–10", free: false, kerndoel: "Kerndoel rekenen 1–6" },
  { id: "stapel", title: "Letterstapel", subject: "Taal", tone: "taal", blurb: "Tik letters in de vakjes tot het woord er staat. Bouwen is sterker dan aankruisen.", learns: "Woordbouw en spelling", mission: "Stapel het woord letter voor letter", minutes: "6–10 min", ages: "5–12", free: false, kerndoel: "Kerndoelen Nederlands 4–8" },
  { id: "bakken", title: "Twee bakken", subject: "Denken", tone: "denken", blurb: "Even of oneven, ei of ij. Tik, kies een bak. Sorteren is de regel in je vingers.", learns: "Classificeren", mission: "Alles in de goede bak", minutes: "5–8 min", ages: "5–12", free: false, kerndoel: "Kerndoel rekenen 23 · spelling" },
  { id: "kassa", title: "Kassa", subject: "Rekenen", tone: "rekenen", blurb: "Tik munten tot het bedrag klopt. Eerst de grote, dan bijpassen — zoals in de winkel.", learns: "Geld rekenen", mission: "Maak het bedrag met munten", minutes: "6–10 min", ages: "6–12", free: false, kerndoel: "Kerndoel rekenen 12" },
  { id: "draai", title: "Draaiom", subject: "Brein", tone: "denken", blurb: "Draai twee kaarten om. Som en antwoord horen bij elkaar. Kijken, zeggen, onthouden.", learns: "Werkgeheugen en sommen", mission: "Vind elk paar", minutes: "5–8 min", ages: "5–12", free: false, kerndoel: "Executieve functies · rekenen" },
  { id: "honderd", title: "Honderdveld", subject: "Rekenen", tone: "rekenen", blurb: "Tik het vak. De rij is tien, de kolom de eenheden. Zo voel je waar een getal woont.", learns: "Getalstructuur tot 100", mission: "Vind het getal op het veld", minutes: "5–8 min", ages: "4–10", free: true, kerndoel: "Kerndoel rekenen 1–6" },
  { id: "taart", title: "Taartstuk", subject: "Rekenen", tone: "rekenen", blurb: "Tik de stukken tot de breuk klopt. Eerst zien, dan zeggen: de helft, een kwart, drie achtste.", learns: "Breuken als deel van een geheel", mission: "Vul de taart tot de breuk klopt", minutes: "6–10 min", ages: "6–12", free: false, kerndoel: "Kerndoel rekenen 9–10" },
  { id: "kralen", title: "Kralenrek", subject: "Rekenen", tone: "rekenen", blurb: "Schuif de kralen. Vijf rood, vijf wit — zoals op school. Tot je tien ziet zonder te tellen.", learns: "Getalbeelden tot 20", mission: "Schuif tot het getal er staat", minutes: "5–8 min", ages: "4–8", free: false, kerndoel: "Kerndoel rekenen 1–4" },
  { id: "rij", title: "Op een rij", subject: "Denken", tone: "denken", blurb: "Zet getallen, dagen of maten in de goede volgorde. Tik, schuif, klaar — de rij zit vast.", learns: "Ordenen en vergelijken", mission: "Zet alles van klein naar groot", minutes: "5–8 min", ages: "4–12", free: false, kerndoel: "Kerndoel rekenen 23" },
  { id: "jacht", title: "Letterjacht", subject: "Taal", tone: "taal", blurb: "Trek een pad door de letters tot het woord eruit springt. Lezen met je vinger.", learns: "Woordherkenning", mission: "Sleep het woord uit het rooster", minutes: "6–10 min", ages: "5–12", free: false, kerndoel: "Kerndoelen Nederlands 4–6" },
  { id: "weeg", title: "Weegschaal", subject: "Rekenen", tone: "rekenen", blurb: "Leg gewichten tot de schaal in evenwicht is. Links is rechts — dat is écht rekenen.", learns: "Evenwicht en ontbrekend getal", mission: "Maak beide kanten even zwaar", minutes: "5–8 min", ages: "5–12", free: false, kerndoel: "Kerndoel rekenen 5–7" },
  { id: "spiegel", title: "Spiegelbeeld", subject: "Denken", tone: "denken", blurb: "De linkerkant staat. Tik de rechterkant tot hij spiegelt. Vorm, as, klaar.", learns: "Spiegelen en ruimtelijk inzicht", mission: "Maak het spiegelbeeld af", minutes: "5–8 min", ages: "4–10", free: false, kerndoel: "Kerndoel rekenen 32" },
  { id: "zin", title: "Zinbouw", subject: "Taal", tone: "taal", blurb: "Tik de woorden in de goede volgorde. Wie, wat, waar — tot de zin klopt.", learns: "Zinsbouw en woordvolgorde", mission: "Bouw de zin tot hij loopt", minutes: "6–10 min", ages: "5–12", free: false, kerndoel: "Kerndoelen Nederlands 6–8" },
  { id: "regen", title: "Getallenregen", subject: "Rekenen", tone: "rekenen", blurb: "Getallen vallen. Tik het goede voor hij de grond raakt. Snel kijken, dan tikken.", learns: "Getalherkenning onder tijd", mission: "Vang het getal uit de regen", minutes: "4–7 min", ages: "4–10", free: true, kerndoel: "Kerndoel rekenen 1–4" },
  { id: "ballon", title: "Ballonvang", subject: "Rekenen", tone: "rekenen", blurb: "Ballonnen stijgen. Tik het goede getal voor hij weg is. Kijken, dan prikken.", learns: "Getalherkenning en reactie", mission: "Prik de goede ballon", minutes: "4–7 min", ages: "4–10", free: true, kerndoel: "Kerndoel rekenen 1–4" },
  { id: "sprint", title: "Rekensprint", subject: "Rekenen", tone: "rekenen", blurb: "De som staat vast. Antwoorden springen rond. Tik het goede voor de tijd op is.", learns: "Sommen onder tijddruk", mission: "Tik het antwoord dat beweegt", minutes: "5–8 min", ages: "6–12", free: false, kerndoel: "Kerndoel rekenen 4–5" },
];

export const FREE_GAMES: GameId[] = GAMES.filter((g) => g.free).map((g) => g.id);
export const ALL_GAMES: GameId[] = GAMES.map((g) => g.id);
export const GAME_COUNT = GAMES.length;

const DUTCH_COUNT: Record<number, string> = {
  5: "vijf",
  14: "veertien",
  20: "twintig",
  22: "tweeëntwintig",
  23: "drieëntwintig",
  24: "vierentwintig",
  25: "vijfentwintig",
};

export function dutchGameCount(cap = false): string {
  const word = DUTCH_COUNT[GAME_COUNT] ?? String(GAME_COUNT);
  if (!cap) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function gameById(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
