import { createFileRoute } from "@tanstack/react-router";
import { CopyBlock } from "@/components/copy-block";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND, PALETTE, euro, PRICE } from "@/lib/lumi/brand";
import { COPY } from "@/lib/lumi/copykit";

export const Route = createFileRoute("/merk")({ component: Merk });

const DOWNLOADS = [
  { href: "/logo-mark.svg", name: "lumi-icoon.svg", label: "Icoon SVG" },
  { href: "/logo.svg", name: "lumi-logo.svg", label: "Logo + naam SVG" },
  { href: "/favicon.svg", name: "lumi-favicon.svg", label: "Favicon SVG" },
  { href: "/logo-mark-512.png", name: "lumi-icoon-512.png", label: "Icoon PNG 512" },
  { href: "/apple-touch-icon.png", name: "lumi-apple-touch.png", label: "Apple-icoon 180" },
  { href: "/logo-lockup.png", name: "lumi-lockup.png", label: "Lockup PNG" },
  { href: "/art/campaign/poster-ouder.jpg", name: "lumi-poster-ouder.jpg", label: "Poster ouder" },
  { href: "/art/campaign/poster-school.jpg", name: "lumi-poster-school.jpg", label: "Poster school" },
  { href: "/art/campaign/ad-instagram.jpg", name: "lumi-instagram.jpg", label: "Instagram 1:1" },
  { href: "/art/campaign/ad-facebook.jpg", name: "lumi-facebook.jpg", label: "Facebook / OG" },
  { href: "/brand/teksten.txt", name: "lumi-teksten.txt", label: "Alle teksten" },
  { href: "/brand/kleuren.txt", name: "lumi-kleuren.txt", label: "Kleuren" },
  { href: "/merkkit.zip", name: "lumi-merkkit.zip", label: "Alles in één zip" },
] as const;

const PALETTE_CLS = [
  "bg-primary text-primary-fg",
  "bg-ink text-primary-fg",
  "bg-bg text-ink",
  "bg-surface text-ink",
] as const;

function Merk() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Kicker>Merkkit</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {BRAND.name}
        </h1>
        <p className="mt-3 font-display text-2xl text-clay">{BRAND.slogan}</p>
        <p className="mt-3 text-lg text-muted">
          {BRAND.tagline}. {BRAND.claim} Uitspraak: {COPY.pronunciation}.
        </p>

        <section className="mt-12 overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          <img
            src="/art/campaign/poster-ouder.jpg"
            alt="Campagneposter: papieren uil bij een terracotta lantaarn, slogan Niet nappraten. Vooruitdenken."
            className="w-full"
          />
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl">Drie zinnen. Niet meer.</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["Slogan", BRAND.slogan, "Campagne, ads, outdoor. Het verschil."],
              ["Tagline", BRAND.tagline, "Onder het logo. Wat het leren doet."],
              ["Bewijs", BRAND.line, "Wat er in de app zit. Altijd in deze volgorde."],
            ].map(([t, v, n]) => (
              <Card key={t} className="rounded-2xl p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-faint">{t}</p>
                <p className="mt-2 font-display text-xl">{v}</p>
                <p className="mt-2 text-sm text-muted">{n}</p>
              </Card>
            ))}
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Squla klinkt als een catalogus. Duolingo heeft de uil. Chatbots voor kinderen laten
            nappraten. Lumi is licht in het hoofd: ophalen, checken, sturen. Nooit “AI-tutor”.
            Nooit “slimme quiz”. Nooit LUMI in lopende tekst.
          </p>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col items-center rounded-2xl p-8">
            <img src="/logo-mark.svg" alt="Lumi icoon" className="size-28" width={112} height={112} />
            <p className="mt-4 font-medium">Icoon — het licht</p>
            <p className="text-center text-sm text-muted">
              Terracotta, twee ringen. Een lantaarn, geen uil. Voor app, tab, avatar.
            </p>
          </Card>
          <Card className="flex flex-col items-center overflow-hidden rounded-2xl p-0">
            <img src="/art/campaign/uil.jpg" alt="" className="h-40 w-full object-cover" />
            <div className="p-6 text-center">
              <p className="font-medium">Mascotte — de uil</p>
              <p className="mt-2 text-sm text-muted">
                Papier, terracotta, stil. Alleen in campagnes en op het speelveld. Nooit als logo.
              </p>
            </div>
          </Card>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl">Waarom deze naam</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            <strong className="text-ink">{BRAND.name}</strong> is kort, Nederlands
            uitspreekbaar ({COPY.pronunciation}) en betekent licht. Geen speelgoednaam,
            geen quiznaam. Lumi klinkt als een object dat je in huis zet.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Reclame</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Beeld is stil, terracotta, papier. Tekst staat eroverheen — nooit in het plaatje
            zelf. Eén boodschap per uiting.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href="/art/campaign/poster-ouder.jpg" download="lumi-poster-ouder.jpg" className="block">
              <Card className="lumi-lift overflow-hidden rounded-3xl p-0">
                <img src="/art/campaign/poster-ouder-sm.jpg" alt="Poster voor ouders" className="w-full" />
                <p className="p-4 text-sm">Ouders · 4:5 · Instagram / print</p>
              </Card>
            </a>
            <a href="/art/campaign/poster-school.jpg" download="lumi-poster-school.jpg" className="block">
              <Card className="lumi-lift overflow-hidden rounded-3xl p-0">
                <img src="/art/campaign/poster-school.jpg" alt="Poster voor de klas" className="h-64 w-full object-cover" />
                <p className="p-4 text-sm">School · teamkamer / A3</p>
              </Card>
            </a>
            <a href="/art/campaign/ad-instagram.jpg" download="lumi-instagram.jpg" className="block">
              <Card className="lumi-lift overflow-hidden rounded-3xl p-0">
                <img src="/art/campaign/ad-instagram.jpg" alt="Instagram-advertentie" className="w-full" />
                <p className="p-4 text-sm">Instagram · 1:1</p>
              </Card>
            </a>
            <a href="/art/campaign/ad-facebook.jpg" download="lumi-facebook.jpg" className="block">
              <Card className="lumi-lift overflow-hidden rounded-3xl p-0">
                <img src="/art/campaign/ad-facebook.jpg" alt="Facebook-advertentie" className="w-full" />
                <p className="p-4 text-sm">Facebook / deelkaart · 16:9</p>
              </Card>
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Kleuren</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Chrome is papier en inkt. Terracotta is het enige pigment — knoppen, icoon,
            één accent. Nooit het hele scherm vol kleur.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PALETTE.map((c, i) => (
              <div key={c.hex} className={`rounded-xl p-4 shadow-[var(--shadow-card)] ${PALETTE_CLS[i]}`}>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="mt-1 font-mono text-xs">{c.hex}</p>
                <p className="mt-2 text-xs opacity-80">{c.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Letters</h2>
          <p className="mt-2 text-muted">
            Koppen: Fraunces — editorial, warm. Tekst: Lexend — gemaakt om lezen lichter te maken,
            ook voor kinderen die moeite hebben met letters.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Download alles</h2>
          <p className="mt-2 text-sm text-muted">
            SVG voor print en web. Posters voor WhatsApp, Facebook en de teamkamer.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {DOWNLOADS.map((d) => (
              <Button key={d.href} variant="secondary" size="sm" asChild>
                <a href={d.href} download={d.name}>
                  {d.label}
                </a>
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Klaar om te sturen</h2>
          <p className="mt-2 text-sm text-muted">Kopieer en plak. Geen extra schrijfwerk.</p>
          <div className="mt-4 grid gap-4">
            <CopyBlock label="WhatsApp naar een ouder" text={COPY.whatsappOuder} />
            <CopyBlock label="WhatsApp naar een juf" text={COPY.whatsappJuf} />
            <CopyBlock label="Facebook / ouderapp" text={COPY.facebook} />
            <CopyBlock label="Instagram" text={COPY.instagram} />
            <CopyBlock label="Bio" text={COPY.bio} />
            <CopyBlock label="E-mail juf" text={`Onderwerp: ${COPY.emailJufSubject}\n\n${COPY.emailJuf}`} />
          </div>
        </section>

        <section id="drukwerk" className="mt-16 rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)] print:shadow-none">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.svg" alt="" className="size-12" width={48} height={48} />
            <div>
              <p className="font-display text-3xl">{BRAND.name}</p>
              <p className="text-sm text-muted">{BRAND.slogan}</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-lg">{BRAND.claim}</p>
          <ul className="mt-4 grid gap-1 text-sm text-muted">
            <li>{BRAND.line}</li>
            <li>Groep 1 tot 8 · geen chatbot · geen reclame</li>
            <li>Gezin {euro(PRICE.gezin)} · School {euro(PRICE.school)} per klas</li>
            <li>7 dagen gratis</li>
          </ul>
          <p className="mt-6 text-sm">Print deze kaart. Hang hem in de teamkamer.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
