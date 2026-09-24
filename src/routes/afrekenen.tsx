import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { euro } from "@/lib/lumi/brand";
import { PLANS, SCHOOL_PLAN } from "@/lib/lumi/pricing";
import { activatePlan, startTrial } from "@/lib/lumi/server";
import { useFamily } from "@/lib/lumi/use-family";
import type { PlanId } from "@/lib/lumi/types";

type Search = { plan?: "gezin" | "plus" | "school"; yearly?: boolean };

export const Route = createFileRoute("/afrekenen")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: s.plan === "plus" || s.plan === "school" ? s.plan : "gezin",
    yearly: s.yearly === true || s.yearly === "1" || s.yearly === "true",
  }),
  component: Afrekenen,
});

function Afrekenen() {
  const { user, isPending } = useCurrentUserState();
  const { plan, yearly } = Route.useSearch();
  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) {
    const next = yearly ? `/afrekenen?plan=${plan}&yearly=1` : `/afrekenen?plan=${plan}`;
    return <Navigate to="/login" search={{ next }} />;
  }
  return <Checkout />;
}

function Checkout() {
  const { plan } = Route.useSearch();
  const search = Route.useSearch();
  const [yearly, setYearly] = useState(!!search.yearly);
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  const { data } = useFamily();

  const spec =
    plan === "school"
      ? SCHOOL_PLAN
      : plan === "plus"
        ? PLANS.find((p) => p.id === "plus")!
        : PLANS.find((p) => p.id === "gezin")!;
  const price = yearly ? spec.priceYear : spec.priceMonth;
  const trialAvailable = data ? !data.entitlement.premium && !data.subscription.trialUsed : true;

  async function pay() {
    if (!adult) {
      setErr("Bevestig dat je 18 jaar of ouder bent.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await activatePlan({ data: { plan: spec.id as Exclude<PlanId, "free" | "trial">, yearly } });
      void nav({ to: "/ouders" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Mislukt");
      setBusy(false);
    }
  }

  async function trial() {
    setBusy(true);
    setErr(null);
    try {
      await startTrial();
      void nav({ to: "/ouders" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Mislukt");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-16">
        <Kicker>Afrekenen</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{spec.name}</h1>
        <p className="mt-2 text-muted">{spec.tagline}</p>

        <Card className="mt-8 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Periode</p>
            <button
              type="button"
              className="text-sm font-medium text-primary"
              onClick={() => setYearly((v) => !v)}
            >
              {yearly ? "Liever per maand" : "Per jaar · 2 maanden cadeau"}
            </button>
          </div>
          <p className="mt-4 font-display text-4xl tabular-nums">
            {euro(price)}
            <span className="text-base text-muted">{yearly ? " /jr" : " /mnd"}</span>
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-muted">
            {spec.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <label className="mt-6 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-[var(--color-primary)]"
              checked={adult}
              onChange={(e) => setAdult(e.target.checked)}
            />
            <span>Ik ben 18 jaar of ouder, ouder/voogd/leerkracht, en ga akkoord met de voorwaarden en privacy.</span>
          </label>
          {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
          <Button className="mt-6 w-full" size="lg" disabled={busy} onClick={() => void pay()}>
            {busy ? "Bezig…" : `Activeer ${spec.name}`}
          </Button>
          {trialAvailable && spec.id !== "school" ? (
            <Button className="mt-2 w-full" variant="secondary" disabled={busy} onClick={() => void trial()}>
              Eerst 30 dagen Plus proberen
            </Button>
          ) : null}
          <p className="mt-4 text-xs text-faint">
            iDEAL is nog niet gekoppeld. Tot die tijd activeer je het plan zonder afschrijving, zodat je
            meteen kunt spelen. Opzeggen blijft één tik in de ouderzone.
          </p>
        </Card>
        <p className="mt-6 text-sm">
          <Link to="/prijzen" className="text-muted hover:text-ink">
            Terug naar prijzen
          </Link>
          {" · "}
          <Link to="/voorwaarden" className="text-muted hover:text-ink">
            Voorwaarden
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
