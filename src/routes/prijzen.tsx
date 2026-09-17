import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BRAND, euro } from "@/lib/lumi/brand";
import { PLANS, SCHOOL_PLAN } from "@/lib/lumi/pricing";

export const Route = createFileRoute("/prijzen")({ component: Prijzen });

function Prijzen() {
  const [yearly, setYearly] = useState(false);
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          <img src="/art/ouders-avond.jpg" alt="" className="h-44 w-full object-cover sm:h-56" />
        </div>
        <Kicker>{BRAND.name}</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Eén abonnement. Tot vier kinderen.
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Andere apps rekenen per kind. {BRAND.name} Gezin is {euro(PLANS[1]!.priceMonth)} voor
          het hele huis. Opzeggen in één tik.
        </p>
        <div className="mt-8 flex items-center gap-3 text-sm">
          <span className={yearly ? "text-muted" : "font-medium"}>Per maand</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((v) => !v)}
            className={
              yearly
                ? "relative h-7 w-12 rounded-full bg-primary"
                : "relative h-7 w-12 rounded-full bg-surface-2"
            }
          >
            <span
              className={
                yearly
                  ? "absolute left-6 top-1 size-5 rounded-full bg-primary-fg"
                  : "absolute left-1 top-1 size-5 rounded-full bg-ink"
              }
            />
          </button>
          <span className={yearly ? "font-medium" : "text-muted"}>Per jaar · 2 maanden cadeau</span>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => {
            const price = yearly && p.priceYear > 0 ? p.priceYear : p.priceMonth;
            const suffix = p.priceMonth === 0 ? "" : yearly ? " /jr" : " /mnd";
            return (
              <Card
                key={p.id}
                className={p.highlight ? "lumi-lift rounded-3xl p-6 ring-2 ring-primary" : "lumi-lift rounded-3xl p-6"}
              >
                <p className="text-sm text-muted">{p.name}</p>
                <p className="mt-2 font-display text-4xl tabular-nums">
                  {euro(price)}
                  <span className="text-base text-muted">{suffix}</span>
                </p>
                {p.priceYear > 0 && !yearly ? (
                  <p className="text-sm text-muted">of {euro(p.priceYear)} per jaar</p>
                ) : p.priceYear > 0 && yearly ? (
                  <p className="text-sm text-muted">
                    {euro(Math.round((p.priceYear / 12) * 100) / 100)} per maand
                  </p>
                ) : null}
                <p className="mt-2 text-sm">{p.tagline}</p>
                <ul className="mt-6 grid gap-2 text-sm text-muted">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={p.highlight ? "default" : "secondary"} asChild>
                  {p.id === "free" ? (
                    <Link to="/login" search={{ next: "/ouders" }}>
                      {p.cta}
                    </Link>
                  ) : (
                    <Link
                      to="/afrekenen"
                      search={{ plan: p.id === "plus" ? "plus" : "gezin", yearly }}
                    >
                      {p.cta}
                    </Link>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        <section className="mt-16 grid gap-8 rounded-2xl bg-ink px-6 py-12 text-primary-fg sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <Kicker onInk>Voor de klas</Kicker>
            <h2 className="mt-3 font-display text-3xl">{SCHOOL_PLAN.name}</h2>
            <p className="mt-2 text-primary-fg/70">{SCHOOL_PLAN.tagline}</p>
            <ul className="mt-6 grid gap-2 text-sm text-primary-fg/80">
              {SCHOOL_PLAN.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-4xl tabular-nums">
              {euro(yearly ? SCHOOL_PLAN.priceYear : SCHOOL_PLAN.priceMonth)}
              <span className="text-lg">{yearly ? " /jr" : " /mnd"}</span>
            </p>
            <p className="mt-1 text-sm text-primary-fg/60">
              {yearly
                ? `${euro(Math.round((SCHOOL_PLAN.priceYear / 12) * 100) / 100)} per maand`
                : `of ${euro(SCHOOL_PLAN.priceYear)} per jaar`}
            </p>
            <Button className="mt-6 w-full" asChild>
              <Link to="/school">{SCHOOL_PLAN.cta}</Link>
            </Button>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
          <h2 className="font-display text-2xl">Cadeau: een jaar Lumi</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Voor een verjaardag of Sinterklaas. {euro(PLANS[1]!.priceYear)} voor vier kinderen, het hele jaar.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/afrekenen" search={{ plan: "gezin", yearly: true }}>
              Geef een jaar
            </Link>
          </Button>
        </section>

        <p className="mt-10 max-w-2xl text-sm text-muted">
          iDEAL volgt. Tot die tijd activeer je een plan zonder afschrijving — zodat je alles kunt
          testen. Opzeggen blijft één tik.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
