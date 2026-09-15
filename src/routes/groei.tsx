import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Kicker } from "@/components/kicker";
import { CopyBlock } from "@/components/copy-block";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BRAND, NEEDED, PRICE, TARGET_MRR, euro } from "@/lib/lumi/brand";
import { COPY } from "@/lib/lumi/copykit";
import { getGrowthStats, type GrowthStats } from "@/lib/lumi/server";

export const Route = createFileRoute("/groei")({ component: Groei });

const TASKS = [
  "Stuur de juf-WhatsApp naar 10 groepsleerkrachten groep 3–5.",
  "Plaats het Facebookbericht in twee ouder groepen.",
  "Print de merkkaart en geef hem aan één intern begeleider.",
  "Vraag elke betalende ouder één doorverwijzing (code in de ouderzone).",
  "Zet één klas op School-proef. Ouders volgen vanzelf.",
] as const;

function isoWeekKey(): string {
  const d = new Date();
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function Groei() {
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [gezinnen, setGezinnen] = useState<number>(NEEDED.mixGezinnen);
  const [plus, setPlus] = useState<number>(0);
  const [klassen, setKlassen] = useState<number>(NEEDED.mixKlassen);
  const [checks, setChecks] = useState<boolean[]>(() => TASKS.map(() => false));

  useEffect(() => {
    void getGrowthStats()
      .then((s) => {
        setStats(s);
        setGezinnen(Math.max(s.gezin, 0));
        setPlus(Math.max(s.plus, 0));
        setKlassen(Math.max(s.school, 0));
      })
      .catch(() =>
        setStats({
          gezin: 0,
          plus: 0,
          school: 0,
          trial: 0,
          free: 0,
          leads: 0,
          referrals: 0,
          mrr: 0,
          target: TARGET_MRR,
        }),
      );
    try {
      const raw = window.localStorage.getItem(`lumi.week.${isoWeekKey()}`);
      if (raw) setChecks(JSON.parse(raw) as boolean[]);
    } catch {
      /* ignore */
    }
    setOrigin(window.location.origin);
  }, []);

  const mrr = stats?.mrr ?? 0;
  const pct = Math.min(100, Math.round((mrr / TARGET_MRR) * 100));
  const gap = Math.max(0, TARGET_MRR - mrr);
  const planMrr = gezinnen * PRICE.gezin + plus * PRICE.plus + klassen * PRICE.school;
  const planHit = planMrr >= TARGET_MRR;
  const [origin, setOrigin] = useState("");

  const neededMore = useMemo(() => {
    const rest = Math.max(0, TARGET_MRR - mrr);
    return {
      gezin: Math.ceil(rest / PRICE.gezin),
      school: Math.ceil(rest / PRICE.school),
    };
  }, [mrr]);

  function toggle(i: number) {
    setChecks((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      try {
        window.localStorage.setItem(`lumi.week.${isoWeekKey()}`, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <Kicker>Doel</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          {euro(TARGET_MRR)} per maand
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          {BRAND.name} haalt dat met gezinnen en klassen. {NEEDED.gezinnen} Gezin-abonnementen,
          of {NEEDED.klassen} klassen, of tien scholen plus {NEEDED.mixGezinnen} gezinnen.
        </p>

        <Card className="mt-10 rounded-xl p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted">Maandomzet nu</p>
              <p className="font-display text-4xl tabular-nums">{euro(mrr)}</p>
            </div>
            <p className="text-sm text-muted">
              {mrr >= TARGET_MRR
                ? "Doel gehaald."
                : `nog ${euro(gap)} · ${pct}% van het doel`}
            </p>
          </div>
          <Progress className="mt-4 h-3" value={pct} />
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:grid-cols-6">
            <Stat k="Gezin" v={stats?.gezin ?? "…"} />
            <Stat k="Plus" v={stats?.plus ?? "…"} />
            <Stat k="School" v={stats?.school ?? "…"} />
            <Stat k="Proef" v={stats?.trial ?? "…"} />
            <Stat k="Klasaanvragen" v={stats?.leads ?? "…"} />
            <Stat k="Doorverwijzingen" v={stats?.referrals ?? "…"} />
          </div>
          <p className="mt-4 text-sm text-muted">
            Nog {neededMore.gezin} gezinnen óf {neededMore.school} klassen tot {euro(TARGET_MRR)}.
          </p>
        </Card>

        <h2 className="mt-14 font-display text-2xl">Reken het plan tot het doel</h2>
        <p className="mt-2 text-sm text-muted">
          Sleep tot de balk groen is. Dat is het aantal dat je deze maand sluit.
        </p>
        <Card className="mt-4 rounded-xl p-6">
          <SliderRow label="Gezin" value={gezinnen} max={250} price={PRICE.gezin} onChange={setGezinnen} />
          <SliderRow label="Plus" value={plus} max={80} price={PRICE.plus} onChange={setPlus} />
          <SliderRow label="Klas" value={klassen} max={60} price={PRICE.school} onChange={setKlassen} />
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-muted">Dit plan</p>
              <p className="font-display text-3xl tabular-nums">{euro(planMrr)}</p>
            </div>
            <p className={planHit ? "text-sm text-ok" : "text-sm text-muted"}>
              {planHit
                ? `Doel gehaald — ${euro(planMrr)} is boven ${euro(TARGET_MRR)}.`
                : `Nog ${euro(Math.max(0, TARGET_MRR - planMrr))} te gaan.`}
            </p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Hint
              title="Pad A · alleen gezinnen"
              body={`${NEEDED.gezinnen} × ${euro(PRICE.gezin)} = ${euro(NEEDED.gezinnen * PRICE.gezin)}`}
              onPick={() => {
                setGezinnen(NEEDED.gezinnen);
                setPlus(0);
                setKlassen(0);
              }}
            />
            <Hint
              title="Pad B · mix (aanbevolen)"
              body={`${NEEDED.mixKlassen} klassen + ${NEEDED.mixGezinnen} gezinnen`}
              onPick={() => {
                setGezinnen(NEEDED.mixGezinnen);
                setPlus(0);
                setKlassen(NEEDED.mixKlassen);
              }}
              featured
            />
            <Hint
              title="Pad C · alleen klassen"
              body={`${NEEDED.klassen} × ${euro(PRICE.school)} = ${euro(NEEDED.klassen * PRICE.school)}`}
              onPick={() => {
                setGezinnen(0);
                setPlus(0);
                setKlassen(NEEDED.klassen);
              }}
            />
          </div>
        </Card>

        <h2 className="mt-14 font-display text-2xl">Deze week — afvinken</h2>
        <ol className="mt-4 grid gap-3">
          {TASKS.map((t, i) => (
            <li key={t}>
              <label className="flex cursor-pointer gap-3 rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-[var(--color-primary)]"
                  checked={!!checks[i]}
                  onChange={() => toggle(i)}
                />
                <span className={checks[i] ? "text-muted line-through" : ""}>
                  <span className="mr-2 tabular-nums text-primary">{i + 1}</span>
                  {t}
                </span>
              </label>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 font-display text-2xl">Klaar om te sturen</h2>
        <div className="mt-4 grid gap-4">
          <CopyBlock label="WhatsApp juf" text={`${COPY.whatsappJuf} ${origin}/school`} />
          <CopyBlock label="WhatsApp ouder" text={`${COPY.whatsappOuder} ${origin}/login?next=/ouders`} />
          <CopyBlock label="Facebook" text={COPY.facebook} />
          <CopyBlock label="E-mail juf" text={`Onderwerp: ${COPY.emailJufSubject}\n\n${COPY.emailJuf}\n\n${origin}/school`} />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/school">Schoolkit</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/merk">Logo, naam en downloads</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/prijzen">Prijzen</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ k, v }: { k: string; v: number | string }) {
  return (
    <div>
      <p className="text-muted">{k}</p>
      <p className="font-display text-2xl tabular-nums">{v}</p>
    </div>
  );
}

function SliderRow({
  label,
  value,
  max,
  price,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  price: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="mt-4 block">
      <div className="flex justify-between text-sm">
        <span>
          {label} · {value}
        </span>
        <span className="tabular-nums text-muted">{euro(value * price)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-primary)]"
      />
    </label>
  );
}

function Hint({
  title,
  body,
  onPick,
  featured,
}: {
  title: string;
  body: string;
  onPick: () => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={
        featured
          ? "rounded-xl p-4 text-left ring-2 ring-primary"
          : "rounded-xl bg-surface-2 p-4 text-left"
      }
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </button>
  );
}
