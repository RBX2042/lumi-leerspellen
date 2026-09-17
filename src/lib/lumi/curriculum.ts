import type { GameId, GroupKey } from "./types.ts";

export type Vak = "mix" | "rekenen" | "taal" | "wereld" | "ai";

export const VAKKEN: { id: Vak; label: string; blurb: string }[] = [
  { id: "mix", label: "Vanavond klaar", blurb: "Wat deze groep nu moet kunnen — door elkaar." },
  { id: "rekenen", label: "Rekenen", blurb: "Getallen, tafels, klok, geld, breuken." },
  { id: "taal", label: "Taal", blurb: "Letters, spelling, zinnen." },
  { id: "wereld", label: "De wereld", blurb: "Nederland, provincies, hoofdsteden." },
  { id: "ai", label: "AI-wijs", blurb: "Checken, duidelijk vragen, jij blijft de baas." },
];

export interface Theory {
  title: string;
  rule: string;
  do: string;
}

export interface GroupPlan {
  key: GroupKey;
  headline: string;
  focus: string[];
  games: GameId[];
  theory: Record<Vak, Theory>;
}

const REKENEN: GameId[] = [
  "rekenpad",
  "tafeltuin",
  "maak10",
  "sprong",
  "honderd",
  "taart",
  "kralen",
  "kassa",
  "weeg",
  "klokkijken",
];
const TAAL: GameId[] = ["letterbos", "woordvanger", "stapel", "zin", "jacht"];
const WERELD: GameId[] = ["topo"];
const AI: GameId[] = ["vraagbaas", "klopt", "opdracht"];

function pickGames(ids: GameId[], allow: GameId[]): GameId[] {
  const set = new Set(allow);
  return ids.filter((id) => set.has(id));
}

export const CURRICULUM: Record<GroupKey, GroupPlan> = {
  groep1: {
    key: "groep1",
    headline: "Tellen, letters, onthouden. Kort, met je vingers.",
    focus: ["Tellen tot 10", "Eerste letters", "Kijken-zeggen-tikken"],
    games: ["kralen", "sprong", "letterbos", "geheugen", "maak10", "klopt"],
    theory: {
      mix: {
        title: "Eerst kijken, dan tikken",
        rule: "Tel hardop. Wijs mee. Eén keer per ding.",
        do: "Niet gokken. Wijs, zeg, tik.",
      },
      rekenen: {
        title: "Tellen is wijzen",
        rule: "Elk ding één getal. Het laatste getal is hoeveel het er zijn.",
        do: "Wijs elk lichtje. Stop als je klaar bent.",
      },
      taal: {
        title: "De eerste klank",
        rule: "Zeg het woord heel langzaam. Wat je eerst hoort, is de letter.",
        do: "Mond open. Eerste klank telt.",
      },
      wereld: {
        title: "Nederland is ons land",
        rule: "Noord is boven op de kaart. Water is vaak blauw.",
        do: "Kijk naar de vorm, niet naar hoe groot.",
      },
      ai: {
        title: "Jij blijft de baas",
        rule: "Als het raar klinkt, is het vaak niet waar.",
        do: "Check met wat je al weet.",
      },
    },
  },
  groep2: {
    key: "groep2",
    headline: "Tot 20, rijmen, een klok die hele uren zegt.",
    focus: ["Tot 20", "Rijm", "Hele uren"],
    games: ["kralen", "maak10", "sprong", "letterbos", "geheugen", "klokkijken", "vraagbaas"],
    theory: {
      mix: {
        title: "Eerst naar de tien",
        rule: "Tot 10 is een sprong. Daarna de rest.",
        do: "Zeg de tien hardop, dan verder.",
      },
      rekenen: {
        title: "Tien is een huis",
        rule: "Alles tot 10 woont bij elkaar. 8 + 3 is 8 tot 10, dan nog 1.",
        do: "Maak eerst tien, dan de rest.",
      },
      taal: {
        title: "Rijm deelt de staart",
        rule: "Kat en rat klinken achteraan hetzelfde.",
        do: "Zeg beide woorden. Houd de staart vast.",
      },
      wereld: {
        title: "Boven is noord",
        rule: "De kaart heeft noord boven, zuid onder.",
        do: "Wijs eerst noord, dan zoek je de provincie.",
      },
      ai: {
        title: "Zeg wat je wilt",
        rule: "‘Help me’ is vaag. ‘Tel tot tien’ kan een helper doen.",
        do: "Wat, hoeveel, hoe.",
      },
    },
  },
  groep3: {
    key: "groep3",
    headline: "Eerste sommen, eerste woorden, eerste tafels.",
    focus: ["Sommen tot 20", "Letters bouwen", "Tafel van 1–5"],
    games: ["rekenpad", "maak10", "tafeltuin", "stapel", "letterbos", "sprong", "klopt", "kralen"],
    theory: {
      mix: {
        title: "Begin bij het grootste",
        rule: "Het grote getal blijft staan. Het kleine tel je erbij of eraf.",
        do: "Zeg het grote. Tel het kleine.",
      },
      rekenen: {
        title: "Optellen is verder tellen",
        rule: "7 + 5: begin bij 7. Vijf stappen: 8, 9, 10, 11, 12.",
        do: "Vingers mogen. Hardop mag.",
      },
      taal: {
        title: "Letters op een rij",
        rule: "Een woord lees je van links naar rechts. Elke letter een klank.",
        do: "Zeg het woord, dan de letters.",
      },
      wereld: {
        title: "Vorm onthoudt beter dan naam",
        rule: "Limburg is de punt. Friesland heeft Wadden.",
        do: "Kijk naar de vorm, zeg de naam.",
      },
      ai: {
        title: "Klinkt zeker? Check toch",
        rule: "Een machine mag ernaast zitten. Jij rekent na.",
        do: "Klopt het met wat je al weet?",
      },
    },
  },
  groep4: {
    key: "groep4",
    headline: "Tafels, spelling, klok, honderdveld. De kern van de basisschool.",
    focus: ["Tafels 1–10", "ei/ij en d/t", "Klok tot kwartier", "Honderdveld"],
    games: [
      "rekenpad",
      "tafeltuin",
      "woordvanger",
      "klokkijken",
      "honderd",
      "stapel",
      "vraagbaas",
      "maak10",
      "topo",
    ],
    theory: {
      mix: {
        title: "Ophalen, niet herlezen",
        rule: "Je onthoudt het als je het zelf moet zeggen. Niet als je het alleen ziet.",
        do: "Zeg het hardop. Dan tikken.",
      },
      rekenen: {
        title: "Tafels zijn groepjes",
        rule: "6 × 4 is vier groepjes van zes. Of zes groepjes van vier.",
        do: "Zeg de tafel tot je hem hoort, niet telt.",
      },
      taal: {
        title: "ij in ijs, ei in trein",
        rule: "IJs, rijk, tijd: ij. Trein, klein, wei: ei. Zeg het woord.",
        do: "Rek de klank. Schrijf wat je hoort, check de regel.",
      },
      wereld: {
        title: "Twaalf provincies",
        rule: "Noord: Groningen, Friesland, Drenthe. West: de Hollanden. Zuid: Brabant, Limburg, Zeeland.",
        do: "Noord is boven. Vorm eerst, dan de naam.",
      },
      ai: {
        title: "Vaag in, vaag uit",
        rule: "Een goede opdracht noemt wat, hoeveel of hoe.",
        do: "Kies de zin die een helper écht kan doen.",
      },
    },
  },
  groep5: {
    key: "groep5",
    headline: "Breuken, lastige spelling, topo van Nederland.",
    focus: ["Breuken", "Open/gesloten lettergreep", "Provincies + hoofdsteden"],
    games: [
      "rekenpad",
      "tafeltuin",
      "woordvanger",
      "klokkijken",
      "taart",
      "topo",
      "opdracht",
      "honderd",
      "kassa",
    ],
    theory: {
      mix: {
        title: "Eerst de regel, dan de som",
        rule: "Weet je waarom, dan blijft hij zitten. Gokken verdwijnt morgen.",
        do: "Zeg de regel in één zin. Dan pas tikken.",
      },
      rekenen: {
        title: "Een breuk is stukken",
        rule: "De onderkant zegt in hoeveel stukken. De bovenkant hoeveel je pakt.",
        do: "Teken de taart in je hoofd. Tik de stukken.",
      },
      taal: {
        title: "Hij wordt, ik word",
        rule: "Hij/zij/het: stam + t. Ik: stam zonder t. Wordt vs word.",
        do: "Zet ‘hij’ of ‘ik’ ervoor. Hoor je de t?",
      },
      wereld: {
        title: "Stad + provincie is een koppel",
        rule: "Maastricht-Limburg. Haarlem-Noord-Holland. Zeg ze als één zin.",
        do: "Stad, dan de streek: noord, midden, west, zuid.",
      },
      ai: {
        title: "Geef de som mee",
        rule: "‘Reken maar’ heeft geen getal. ‘Is 7+8 = 15?’ wel.",
        do: "Zet de som in de opdracht.",
      },
    },
  },
  groep6: {
    key: "groep6",
    headline: "Kommagetallen, geld, de kaart van Nederland én de wereld.",
    focus: ["Geld en wegen", "Spelling vastzetten", "Nederland + buurlanden"],
    games: [
      "rekenpad",
      "woordvanger",
      "taart",
      "topo",
      "kassa",
      "weeg",
      "klopt",
      "klokkijken",
      "opdracht",
    ],
    theory: {
      mix: {
        title: "Schat eerst, reken daarna",
        rule: "Is 48 + 27 ongeveer 70 of 80? Dan pas precies.",
        do: "Rond af, check, reken na.",
      },
      rekenen: {
        title: "Grootste munt eerst",
        rule: "Bij geld: de grootste munt die nog past, dan bijpassen.",
        do: "Niet alle muntjes tegelijk. Eén voor één.",
      },
      taal: {
        title: "De regel is groter dan het woord",
        rule: "Ken je ei/ij, d/t en open lettergreep, dan vang je nieuwe woorden ook.",
        do: "Niet het woord stampen. De regel zeggen.",
      },
      wereld: {
        title: "Buurlanden om Nederland",
        rule: "West: Noordzee. Oost: Duitsland. Zuid: België.",
        do: "Wijs de zee, dan de landen.",
      },
      ai: {
        title: "Lumi mag klinken, jij mag twijfelen",
        rule: "Zekerheid is geen bewijs. Een som of een kaart is dat wel.",
        do: "Check met rekenen of de kaart.",
      },
    },
  },
  groep7: {
    key: "groep7",
    headline: "Verhoudingen, lastige zinnen, de wereldkaart.",
    focus: ["Verhoudingen en breuken", "Zinnen bouwen", "Wereld + NL-topo"],
    games: [
      "rekenpad",
      "woordvanger",
      "zin",
      "topo",
      "taart",
      "weeg",
      "opdracht",
      "jacht",
      "klopt",
    ],
    theory: {
      mix: {
        title: "Vertaal de som naar een plaatje",
        rule: "Een kwart van 20 is de taart in vier, één stuk: 5.",
        do: "Eerst het plaatje, dan het getal.",
      },
      rekenen: {
        title: "Delen is de tafel achterstevoren",
        rule: "36 ÷ 6 is ‘hoeveel keer 6 in 36?’. 6 × 6 = 36, dus 6.",
        do: "Zeg de tafel tot je het product hoort.",
      },
      taal: {
        title: "Wie of wat eerst",
        rule: "Een Nederlandse zin begint bij wie/wat, dan de rest.",
        do: "Bouw de zin. Extra woordjes laat je liggen.",
      },
      wereld: {
        title: "Wereld = richting + water",
        rule: "Europa west van Azië. Afrika onder Europa. Amerika west over de oceaan.",
        do: "Noord boven. Wijs de oceaan, dan het land.",
      },
      ai: {
        title: "Jij stuurt, de machine volgt",
        rule: "Hoe specifieker de opdracht, hoe bruikbaarder het antwoord.",
        do: "Vorm + onderwerp + hoeveel.",
      },
    },
  },
  groep8: {
    key: "groep8",
    headline: "Klaar voor de brugklas: rekenen vast, taal vast, AI-wijs vast.",
    focus: ["Alle bewerkingen", "Spelling zonder nadenken", "NL + wereld", "Checken van AI"],
    games: [
      "rekenpad",
      "woordvanger",
      "topo",
      "taart",
      "opdracht",
      "klopt",
      "weeg",
      "jacht",
      "zin",
      "kassa",
    ],
    theory: {
      mix: {
        title: "Jij blijft de denker",
        rule: "De brugklas krijgt tools. Wie kan checken, is vooruit. Wie napraten, niet.",
        do: "Eerst zelf. Dan de helper. Dan checken.",
      },
      rekenen: {
        title: "Een som is een plan",
        rule: "Welke bewerking? In welke volgorde? Schat, reken, check.",
        do: "Zeg het plan in één zin voor je tikt.",
      },
      taal: {
        title: "De zin moet lopen",
        rule: "Als hij stokt, staat een woord verkeerd. Lees hem hardop.",
        do: "Oren eerst, dan de volgorde.",
      },
      wereld: {
        title: "Kaart in je hoofd",
        rule: "Provincie, hoofdstad, buurland — drie haken. Eén haak onthoudt de rest.",
        do: "Zeg de drie bij elkaar.",
      },
      ai: {
        title: "Niet nappraten. Vooruitdenken.",
        rule: "Een machine klinkt volwassen en kan toch ernaast zitten. Jij houdt het hoofd erbij.",
        do: "Opdracht geven. Antwoord checken. Zelf beslissen.",
      },
    },
  },
};

export function planFor(group: GroupKey): GroupPlan {
  return CURRICULUM[group];
}

export function homeworkGames(group: GroupKey, vak: Vak): GameId[] {
  const plan = CURRICULUM[group];
  if (vak === "mix") return plan.games;
  if (vak === "rekenen") {
    const hit = pickGames(REKENEN, plan.games);
    return hit.length ? hit : pickGames(REKENEN, REKENEN);
  }
  if (vak === "taal") {
    const hit = pickGames(TAAL, plan.games);
    return hit.length ? hit : pickGames(TAAL, TAAL);
  }
  if (vak === "wereld") return WERELD;
  if (vak === "ai") {
    const hit = pickGames(AI, plan.games);
    return hit.length ? hit : AI;
  }
  return plan.games;
}

export function theoryFor(group: GroupKey, vak: Vak): Theory {
  return CURRICULUM[group].theory[vak];
}

export function theoryForGame(gameId: GameId, group: GroupKey): Theory {
  if (gameId === "huiswerk") return theoryFor(group, getHomeworkVak());
  if (REKENEN.includes(gameId)) return CURRICULUM[group].theory.rekenen;
  if (TAAL.includes(gameId)) return CURRICULUM[group].theory.taal;
  if (WERELD.includes(gameId)) return CURRICULUM[group].theory.wereld;
  if (AI.includes(gameId)) return CURRICULUM[group].theory.ai;
  return CURRICULUM[group].theory.mix;
}

const VAK_KEY = "lumi.hw.vak";

export function setHomeworkVak(vak: Vak): void {
  try {
    sessionStorage.setItem(VAK_KEY, vak);
  } catch {
    /* private mode */
  }
}

export function getHomeworkVak(): Vak {
  try {
    const v = sessionStorage.getItem(VAK_KEY);
    if (v === "rekenen" || v === "taal" || v === "wereld" || v === "ai" || v === "mix") return v;
  } catch {
    /* private mode */
  }
  return "mix";
}

export function isVak(v: string | undefined): v is Vak {
  return v === "mix" || v === "rekenen" || v === "taal" || v === "wereld" || v === "ai";
}
