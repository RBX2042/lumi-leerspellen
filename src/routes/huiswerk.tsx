import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Kicker } from "@/components/kicker";
import { TiltCard } from "@/components/tilt-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { CURRICULUM, VAKKEN, setHomeworkVak, type Vak } from "@/lib/lumi/curriculum";
import { GROUPS, type GroupKey } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/huiswerk")({ component: Huiswerk });

function Huiswerk() {
  const { user } = useCurrentUserState();
  const nav = useNavigate();
  const [groep, setGroep] = useState<GroupKey>("groep4");
  const [vak, setVak] = useState<Vak>("mix");
  const plan = CURRICULUM[groep];
  const theory = plan.theory[vak];
  const start = () => {
    setHomeworkVak(vak);
    if (user) {
      void nav({ to: "/spelen/$gameId", params: { gameId: "huiswerk" }, search: { vak } });
    } else {
      void nav({ to: "/proberen/$gameId", params: { gameId: "huiswerk" }, search: { groep, vak } });
    }
  };
  return (
    <div className="min-h-dvh bg-bg">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <TiltCard>
        <div className="mb-10 overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
          <img src="/art/games/huiswerk.jpg" alt="" className="h-48 w-full object-cover sm:h-56" />
        </div>
        </TiltCard>
        <Kicker>Huiswerk</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Vanavond klaar.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Geen chatbot. Wel de stof van jouw groep: eerst de regel, dan spelen. Rekenen, taal, de
          wereld, AI-wijs — zoals de klas die morgen krijgt.
        </p>

        <section className="mt-10">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">Groep</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setGroep(g.key)}
                className={cn(
                  "h-11 min-w-[4.5rem] flex-1 rounded-full px-3 text-sm sm:flex-none sm:px-4",
                  groep === g.key ? "bg-primary text-primary-fg" : "bg-surface text-ink hover:bg-surface-2",
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">Vak</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {VAKKEN.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVak(v.id)}
                className="text-left"
              >
                <Card
                  className={cn(
                    "rounded-2xl p-4",
                    vak === v.id ? "ring-2 ring-primary" : "",
                  )}
                >
                  <p className="font-display text-xl">{v.label}</p>
                  <p className="mt-1 text-sm text-muted">{v.blurb}</p>
                </Card>
              </button>
            ))}
          </div>
        </section>

        <Card className="mt-8 rounded-3xl p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-faint">Deze groep nu</p>
          <h2 className="mt-2 font-display text-2xl">{plan.headline}</h2>
          <ul className="mt-3 grid gap-1 text-sm text-muted">
            {plan.focus.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl bg-bg px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">{theory.title}</p>
            <p className="mt-1 text-sm text-ink">{theory.rule}</p>
            <p className="mt-2 text-sm text-muted">{theory.do}</p>
          </div>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" onClick={start}>
            Start huiswerk
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
            <Link to="/" hash="spellen">
              Alle spellen
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
