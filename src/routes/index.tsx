import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Lock, Shield, Users } from "lucide-react";
import { useEffect } from "react";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND, euro, PRICE } from "@/lib/lumi/brand";
import { dutchGameCount, GAMES, TONE_BAR, TONE_TEXT } from "@/lib/lumi/catalog";
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
        <section>
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:pb-24 md:pt-16 lg:gap-16 lg:pb-28 lg:pt-20">
            <div>
              <Badge>
                {BRAND.category} · 4–12 jaar
              </Badge>
              <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Schermtijd waar een kind{" "}
                <em className="font-medium italic">écht</em> van leert.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                {dutchGameCount(true)} korte leerspellen, afgestemd op groep 1 tot 8. Jij ziet de
                voortgang. Zij spelen — tikken, slepen, omdraaien. Geen reclame, geen lootboxes, geen
                eindeloze feed.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/login" search={{ next: "/ouders" }}>
                    Start 7 dagen gratis
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/" hash="spellen">
                    Bekijk de spellen
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

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3 md:gap-12">
            {[
              {
                n: "01",
                k: "Ophalen, niet herlezen",
                v: "Kinderen onthouden meer als ze het zelf moeten ophalen. Ze tikken, slepen en bouwen — met uitleg erbij, geen lege ‘goed zo’.",
              },
              {
                n: "02",
                k: "Past zich aan",
                v: "Drie goed? Een trede omhoog. Twee mis? Een trede terug. Altijd in de zone waar het nog lukt.",
              },
              {
                n: "03",
                k: "Kort, en ze komen terug",
                v: "Sessies van 6 tot 12 minuten. Een dagelijkse reeks, XP en badges. Jij zet de daglimiet — Lumi stopt als de tijd om is.",
              },
            ].map((x) => (
              <div key={x.n}>
                <p className="font-display text-sm tabular-nums text-faint">{x.n}</p>
                <h2 className="mt-3 font-display text-2xl font-medium">{x.k}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{x.v}</p>
              </div>
            ))}
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
            breuken, zinnen, werkgeheugen en topo.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {GAMES.map((g) => (
              <Card key={g.id} className="relative flex flex-col overflow-hidden rounded-2xl p-5">
                <span className={cn("absolute inset-y-0 left-0 w-1", TONE_BAR[g.tone])} />
                <div className="flex items-start justify-between gap-2 pl-2">
                  <p className={cn("text-xs font-medium uppercase tracking-wider", TONE_TEXT[g.tone])}>
                    {g.subject}
                  </p>
                  {g.free ? <Badge variant="muted">Gratis</Badge> : <Badge>Gezin</Badge>}
                </div>
                <h3 className="mt-3 pl-2 font-display text-xl font-medium">{g.title}</h3>
                <p className="mt-2 flex-1 pl-2 text-sm leading-relaxed text-muted">{g.blurb}</p>
                <p className="mt-4 pl-2 text-xs text-faint">
                  {g.ages} · {g.minutes}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="waarom" className="bg-ink text-primary-fg">
          <div className="mx-auto max-w-6xl px-4 py-24">
            <Kicker onInk>Waarom dit, en niet nóg een quiz-app</Kicker>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
              Ouders betalen al voor schermtijd. Lumi maakt die tijd verantwoord.
            </h2>
            <div className="mt-14 grid gap-10 md:grid-cols-2">
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
              <ul className="mt-8 grid gap-4 text-sm text-muted">
                {[
                  { icon: Users, t: "Tot vier kindprofielen, elk met eigen niveau" },
                  { icon: Clock, t: "Schermtijd in minuten, niet in vage ‘sessies’" },
                  { icon: Shield, t: "Geen chat, geen vriendenlijst, geen tracking-ads" },
                  { icon: Lock, t: "Terug naar ouderzone achter een pincode" },
                ].map((x) => (
                  <li key={x.t} className="flex gap-3">
                    <x.icon className="mt-0.5 size-4 text-clay" />
                    {x.t}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="rounded-2xl p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-faint">Deze week</p>
              <p className="mt-2 font-display text-2xl">Noor · groep 4</p>
              <div className="mt-6 grid gap-4">
                {[
                  ["Tafels", 78],
                  ["Spelling", 62],
                  ["Klokkijken", 40],
                  ["Werkgeheugen", 84],
                ].map(([k, v]) => (
                  <div key={String(k)}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{k}</span>
                      <span className="tabular-nums text-muted">{v}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted">
                34 minuten gespeeld · sterkste groei op tafels van 7.
              </p>
            </Card>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
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
                      ? "rounded-2xl p-6 ring-2 ring-primary"
                      : "rounded-2xl p-6"
                  }
                >
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
          <dl className="mt-10 grid gap-10">
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
              <div key={x.q}>
                <dt className="font-display text-xl font-medium">{x.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{x.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-4 pb-24">
          <div className="mx-auto max-w-4xl rounded-2xl bg-ink px-6 py-14 text-primary-fg sm:px-14">
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
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Fact({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-primary-fg/65">{body}</p>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-[1.75rem] bg-surface p-2 shadow-[var(--shadow-card)]">
        <div className="rounded-2xl bg-bg px-5 py-6">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.svg" alt="" className="size-9" width={36} height={36} />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-faint">Nu spelen</p>
              <p className="font-display text-lg leading-tight">Honderdveld · groep 4</p>
            </div>
          </div>
          <p className="mt-6 text-center font-display text-2xl font-medium tracking-tight">Tik het vak van 17</p>
          <div className="mx-auto mt-5 grid max-w-[220px] grid-cols-5 gap-1.5">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                className={
                  n === 17
                    ? "grid aspect-square place-items-center rounded-md bg-ok text-sm font-medium text-primary-fg"
                    : "grid aspect-square place-items-center rounded-md bg-surface text-sm font-medium shadow-[var(--shadow-card)]"
                }
              >
                {n}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">3 goed op rij · niveau 4</p>
        </div>
      </div>
    </div>
  );
}
