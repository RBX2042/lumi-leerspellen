import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Lock, Shield, Users } from "lucide-react";
import { useEffect } from "react";
import { Kicker } from "@/components/kicker";
import { TiltCard } from "@/components/tilt-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND, euro, PRICE } from "@/lib/lumi/brand";
import { dutchGameCount, GAMES, TONE_BAR, TONE_TEXT, TONE_WASH, gameArt } from "@/lib/lumi/catalog";
import { PLANS } from "@/lib/lumi/pricing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 lumi-wash" />
          <img
            src="/art/owl.jpg"
            alt=""
            className="pointer-events-none absolute -right-16 top-8 hidden h-64 w-auto opacity-[0.14] lg:block"
            width={200}
            height={300}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:pb-24 md:pt-16 lg:gap-16 lg:pb-28 lg:pt-20">
            <div className="lumi-rise">
              <Badge>
                {BRAND.category} · 4–12 jaar
              </Badge>
              <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Niet nappraten.
                <br />
                <em className="font-medium italic text-clay">Vooruitdenken.</em>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {BRAND.tagline}. {dutchGameCount(true)} korte leerspellen voor groep 1 tot 8.
                Rekenen en taal eerst — plus AI-wijs: checken, duidelijk vragen, jij blijft de
                baas. Geen chatbot, geen reclame, geen eindeloze feed.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/login" search={{ next: "/ouders" }}>
                    Start 7 dagen gratis
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link to="/huiswerk">
                    Huiswerk vanavond
                  </Link>
                </Button>
              </div>
              <p className="mt-5 text-sm text-faint">
                Gezin {euro(PRICE.gezin)}/mnd voor tot vier kinderen. Opzeggen in één tik.
              </p>
            </div>
            <HeroPanel />
          </div>
        </section>

        <section className="border-y border-border bg-surface/80">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 py-16 md:grid-cols-3 md:gap-6">
            {[
              {
                n: "01",
                k: "Ophalen, niet herlezen",
                v: "Kinderen onthouden meer als ze het zelf moeten ophalen. Ze tikken, slepen en bouwen — met uitleg erbij, geen lege ‘goed zo’.",
                art: "/art/tone-rekenen.jpg",
              },
              {
                n: "02",
                k: "Past zich aan",
                v: "Drie goed? Een trede omhoog. Twee mis? Een trede terug. Altijd in de zone waar het nog lukt.",
                art: "/art/tone-denken.jpg",
              },
              {
                n: "03",
                k: "Kort, en ze komen terug",
                v: "Sessies van 6 tot 12 minuten. Een dagelijkse reeks, XP en badges. Jij zet de daglimiet — Lumi stopt als de tijd om is.",
                art: "/art/ouders-avond.jpg",
              },
            ].map((x) => (
              <Card key={x.n} className="lumi-lift overflow-hidden rounded-3xl p-0">
                <div className="relative h-36 overflow-hidden">
                  <img src={x.art} alt="" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                </div>
                <div className="p-6 pt-4">
                  <p className="font-display text-sm tabular-nums text-primary">{x.n}</p>
                  <h2 className="mt-3 font-display text-2xl font-medium">{x.k}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{x.v}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="aiwijs" className="relative overflow-hidden border-b border-border">
          <img
            src="/art/tone-ai.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/88 to-bg" />
          <div className="relative mx-auto max-w-6xl px-4 py-24">
            <Kicker>Daarom anders</Kicker>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
              AI-wijs vóór de rest van de klas.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Geen chatbot voor een kind van acht. Wél de gewoonte die later telt: een
              duidelijke opdracht geven, checken of het klopt, zelf de baas blijven. Zo is
              je kind vooruit — niet omdat het napraat, omdat het nadenkt.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {GAMES.filter((g) => g.tone === "ai").map((g) => (
                <Link key={g.id} to="/proberen/$gameId" params={{ gameId: g.id }} className="block">
                  <TiltCard className="h-full">
                  <Card className="lumi-lift h-full overflow-hidden rounded-3xl p-0">
                    <div className="relative h-36 overflow-hidden">
                      <img src={gameArt(g.id)} alt="" className="size-full object-cover" />
                    </div>
                    <div className="p-5">
                      <p className={cn("text-xs font-medium uppercase tracking-wider", TONE_TEXT[g.tone])}>
                        {g.subject}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-medium">{g.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{g.blurb}</p>
                      <p className="mt-4 text-xs text-faint">{g.learns} · Probeer nu</p>
                    </div>
                  </Card>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="spellen" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
          <Kicker>{dutchGameCount(true)} spellen</Kicker>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
            Niet honderd quizjes. Spellen die je écht speelt.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Tikken, slepen, omdraaien, bouwen. Gebouwd op kerndoelen van het
            Nederlandse basisonderwijs — rekenen en taal eerst, plus klok, geld,
            breuken, zinnen, werkgeheugen, topo en AI-wijs.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {GAMES.map((g) => (
              <Link
                key={g.id}
                to="/proberen/$gameId"
                params={{ gameId: g.id }}
                className="block"
              >
              <Card
                className="lumi-lift group relative flex h-full flex-col overflow-hidden rounded-3xl p-0"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={gameArt(g.id)}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t to-transparent", TONE_WASH[g.tone])} />
                </div>
                <span className={cn("absolute inset-y-0 left-0 w-1", TONE_BAR[g.tone])} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2 pl-1">
                    <p className={cn("text-xs font-medium uppercase tracking-wider", TONE_TEXT[g.tone])}>
                      {g.subject}
                    </p>
                    {g.free ? <Badge variant="muted">Gratis</Badge> : <Badge>Gezin</Badge>}
                  </div>
                  <h3 className="mt-3 pl-1 font-display text-xl font-medium">{g.title}</h3>
                  <p className="mt-2 flex-1 pl-1 text-sm leading-relaxed text-muted">{g.blurb}</p>
                  <p className="mt-4 pl-1 text-xs text-faint">
                    {g.ages} · {g.minutes} · Probeer nu
                  </p>
                </div>
              </Card>
              </Link>
            ))}
          </div>
        </section>

        <section id="waarom" className="relative overflow-hidden bg-ink text-primary-fg">
          <img
            src="/art/tone-taal.jpg"
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-ink/80" />
          <div className="relative mx-auto max-w-6xl px-4 py-24">
            <Kicker onInk>Waarom dit, en niet nóg een quiz-app</Kicker>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
              Ouders betalen al voor schermtijd. Lumi maakt die tijd verantwoord.
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Fact
                title="Squla is sterk, maar per kind"
                body="De bekendste Nederlandse oefenapp rekent grofweg twaalf euro per kind. Gezinnen met twee of drie schoolgaande kinderen betalen dubbel. Lumi Gezin dekt tot vier profielen voor één prijs."
              />
              <Fact
                title="ABCmouse leerde de markt wat niet te doen"
                body="Ouders haken af op lastig opzeggen, upsells in de kind-omgeving en beloningswinkels. Lumi heeft geen winkel, geen reclame, en opzeggen zit in de ouderzone."
              />
              <Fact
                title="Gratis is niet altijd beter"
                body="Khan Academy Kids is uitstekend — en Engels. Nederlandse spelling, klokkijken en topo zitten daar niet. Lumi is gebouwd op groep 1–8, niet op Common Core."
              />
              <Fact
                title="Spel, geen werkblad"
                body="Kinderen stoppen met apps die voelen als huiswerk. Korte rondes, directe feedback. De leerstof is het spel, niet de beloning erna."
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <Kicker>Ouderzone</Kicker>
              <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
                Jij ziet de voortgang. Zij zien alleen het spel.
              </h2>
              <ul className="mt-8 grid gap-3 text-sm text-muted">
                {[
                  { icon: Users, t: "Tot vier kindprofielen, elk met eigen niveau" },
                  { icon: Clock, t: "Schermtijd in minuten, niet in vage ‘sessies’" },
                  { icon: Shield, t: "Geen chat, geen vriendenlijst, geen tracking-ads" },
                  { icon: Lock, t: "Terug naar ouderzone achter een pincode" },
                ].map((x) => (
                  <li key={x.t} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
                    <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-clay">
                      <x.icon className="size-4" />
                    </span>
                    {x.t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
                <img src="/art/ouders-avond.jpg" alt="" className="aspect-[5/4] w-full object-cover" />
              </div>
              <Card className="absolute right-3 bottom-3 left-3 rounded-3xl p-5 sm:left-auto sm:w-80">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Deze week</p>
                <p className="mt-2 font-display text-2xl">Noor · groep 4</p>
                <div className="mt-4 grid gap-3">
                  {[
                    ["Tafels", 78],
                    ["Spelling", 62],
                    ["Klokkijken", 40],
                  ].map(([k, v]) => (
                    <div key={String(k)}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{k}</span>
                        <span className="tabular-nums text-muted">{v}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface/80">
          <div className="mx-auto max-w-6xl px-4 py-24">
            <Kicker>Prijzen</Kicker>
            <h2 className="mt-3 font-display text-3xl font-medium">Eerlijke prijs.</h2>
            <p className="mt-3 max-w-xl text-muted">
              Gezin is {euro(PRICE.gezin)} voor tot vier kinderen. School is {euro(PRICE.school)} per klas,
              tot 30 leerlingen.
            </p>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PLANS.map((p) => (
                <Card
                  key={p.id}
                  className={
                    p.highlight
                      ? "lumi-lift rounded-3xl p-6 ring-2 ring-primary shadow-[var(--shadow-lift)]"
                      : "lumi-lift rounded-3xl p-6"
                  }
                >
                  {p.highlight ? <Badge className="mb-3">Meest gekozen</Badge> : null}
                  <p className="text-sm text-muted">{p.name}</p>
                  <p className="mt-2 font-display text-4xl tabular-nums">
                    {p.priceMonth === 0 ? "€0" : `€${p.priceMonth.toString().replace(".", ",")}`}
                    <span className="text-base text-muted"> /mnd</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                  <ul className="mt-6 grid gap-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" variant={p.highlight ? "default" : "secondary"} asChild>
                    <Link to="/login" search={{ next: "/ouders" }}>
                      {p.cta}
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
            <p className="mt-8">
              <Link to="/school" className="text-sm font-medium text-clay hover:text-ink">
                Lumi voor de klas
              </Link>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-24">
          <h2 className="font-display text-3xl font-medium">Vragen van ouders</h2>
          <dl className="mt-10 grid gap-4">
            {[
              {
                q: "Is dit niet gewoon extra schermtijd?",
                a: "Ja, het is een scherm. Daarom is elke ronde kort, zit er een ouderlijke timer op, en zit er geen feed die oneindig doorgaat. Beter twintig minuten Lumi dan een uur willekeurige video’s.",
              },
              {
                q: "Werkt dit écht voor leren?",
                a: "De kern is retrieval practice: het kind moet het antwoord ophalen, krijgt meteen te horen of het klopt, en ziet de stof terug in een iets andere vorm. Dat is een van de best onderbouwde leerstrategieën. Geen magie, wel repetitie die blijft hangen.",
              },
              {
                q: "Wat als ik twee kinderen heb in andere groepen?",
                a: "Elk profiel heeft een eigen groep en een eigen niveau per spel. Op Gezin of Plus zitten tot vier kinderen in één abonnement — dat is bewust de prijsbreker tegenover apps per kind.",
              },
              {
                q: "Hoe zeg ik op?",
                a: "In de ouderzone, knop ‘Opzeggen’. Geen mail naar een helpdesk, geen verstopte knop. De rest van de periode blijft werken, daarna val je terug op Ontdekker.",
              },
            ].map((x) => (
              <div key={x.q} className="rounded-3xl bg-surface px-6 py-5 shadow-[var(--shadow-card)]">
                <dt className="font-display text-xl font-medium">{x.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{x.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-4 pb-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl text-primary-fg">
            <img src="/art/ouders-avond.jpg" alt="" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-ink/72" />
            <div className="relative px-6 py-14 sm:px-14">
              <img
                src="/art/owl-square.jpg"
                alt=""
                className="mb-5 size-16 rounded-2xl object-cover shadow-[var(--shadow-card)]"
              />
              <Kicker onInk>{BRAND.tagline}</Kicker>
              <h2 className="mt-4 font-display text-3xl font-medium sm:text-4xl">
                Vanavond nog een ronde tafels. Morgen zie jij of het zat.
              </h2>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link to="/login" search={{ next: "/ouders" }}>
                    Maak een ouderaccount
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Fact({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-primary-fg/65">{body}</p>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="lumi-scene relative mx-auto w-full max-w-md">
      <div className="lumi-orbit">
        <TiltCard>
          <div className="relative overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-lift)] lumi-ring">
            <img
              src="/art/hero-table.jpg"
              alt="Houten tafel met tablet, cijferblokken en een uil."
              className="aspect-[5/4] w-full object-cover"
            />
            <div className="absolute inset-x-3 bottom-3 rounded-[1.15rem] bg-surface/92 p-3 shadow-[var(--shadow-card)] backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img src="/art/owl-square.jpg" alt="" className="size-10 rounded-xl object-cover" width={40} height={40} />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.16em] text-faint">Nu spelen</p>
                  <p className="truncate font-display text-base leading-tight">Honderdveld · groep 4</p>
                </div>
                <p className="ml-auto text-xs tabular-nums text-muted">3 op rij</p>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}
