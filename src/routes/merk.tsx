import { createFileRoute } from "@tanstack/react-router";
import { CopyBlock } from "@/components/copy-block";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND, PALETTE } from "@/lib/lumi/brand";
import { COPY } from "@/lib/lumi/copykit";

export const Route = createFileRoute("/merk")({ component: Merk });

const DOWNLOADS = [
  { href: "/logo-mark.svg", name: "lumi-icoon.svg", label: "Icoon SVG" },
  { href: "/logo.svg", name: "lumi-logo.svg", label: "Logo + naam SVG" },
  { href: "/favicon.svg", name: "lumi-favicon.svg", label: "Favicon SVG" },
  { href: "/logo-mark-512.png", name: "lumi-icoon-512.png", label: "Icoon PNG 512" },
  { href: "/apple-touch-icon.png", name: "lumi-apple-touch.png", label: "Apple-icoon 180" },
  { href: "/logo-lockup.png", name: "lumi-lockup.png", label: "Lockup PNG" },
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
        <p className="mt-3 text-lg text-muted">
          {BRAND.tagline}. {BRAND.claim} Uitspraak: {COPY.pronunciation}.
        </p>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col items-center rounded-2xl p-8">
            <img src="/logo-mark.svg" alt="Lumi icoon" className="size-28" width={112} height={112} />
            <p className="mt-4 font-medium">Icoon</p>
            <p className="text-sm text-muted">Licht op terracotta. Voor app, tab, avatar.</p>
          </Card>
          <Card className="flex flex-col items-center rounded-2xl p-8">
            <img src="/logo.svg" alt="Lumi woordmerk" className="h-16 w-auto max-w-full" />
            <p className="mt-4 font-medium">Logo + naam</p>
            <p className="text-sm text-muted">Lockup voor site, mail en print.</p>
          </Card>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl">Waarom deze naam</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            <strong className="text-ink">{BRAND.name}</strong> is kort, Nederlands
            uitspreekbaar ({COPY.pronunciation}) en betekent licht. Geen speelgoednaam,
            geen quiznaam. Squla klinkt als een catalogus. Junior Einstein als huiswerk.
            Lumi klinkt als een object dat je in huis zet.
          </p>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            Nooit LUMI in lopende tekst. Tagline: “{BRAND.tagline}”. Claim: “{BRAND.claim}”.
          </p>
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
            SVG voor print en web. PNG voor WhatsApp, Facebook en het startsheren.
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
            <CopyBlock label="Bio" text={COPY.bio} />
            <CopyBlock label="E-mail juf" text={`Onderwerp: ${COPY.emailJufSubject}\n\n${COPY.emailJuf}`} />
          </div>
        </section>

        <section id="drukwerk" className="mt-16 rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)] print:shadow-none">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.svg" alt="" className="size-12" width={48} height={48} />
            <div>
              <p className="font-display text-3xl">{BRAND.name}</p>
              <p className="text-sm text-muted">{BRAND.tagline}</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-lg">{BRAND.claim}</p>
          <ul className="mt-4 grid gap-1 text-sm text-muted">
            <li>Tafels, spelling, klokkijken, topo</li>
            <li>Groep 1 tot 8 · geen reclame</li>
            <li>Gezin €9,99 · School €49 per klas</li>
            <li>7 dagen gratis</li>
          </ul>
          <p className="mt-6 text-sm">Print deze kaart. Hang hem in de teamkamer.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
