import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Kicker } from "@/components/kicker";
import { KidAvatar } from "@/components/kid-avatar";
import { takeReferral } from "@/components/referral-capture";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { signOut } from "@/lib/auth/client";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GAMES, gameById } from "@/lib/lumi/catalog";
import { inviteText } from "@/lib/lumi/copykit";
import { euro, PRICE } from "@/lib/lumi/brand";
import { emptyProgress, levelFromXp, streakFromDays, weekDots } from "@/lib/lumi/loop";
import { recommendGames } from "@/lib/lumi/path";
import {
  addChild,
  addChildrenBulk,
  applyReferral,
  cancelPlan,
  deleteAccount,
  removeChild,
  setPin,
  startTrial,
  updateChild,
} from "@/lib/lumi/server";
import { AVATARS, GROUPS, groupFromAge, type AvatarId, type Child, type ChildProgress, type GroupKey, type Skill } from "@/lib/lumi/types";
import { setActiveChildId, useFamily } from "@/lib/lumi/use-family";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/ouders")({ component: Ouders });

function Ouders() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="min-h-dvh">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-8 h-40 w-full" />
        </div>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <Ouderzone name={user.displayName || "Ouder"} />;
}

function Ouderzone({ name }: { name: string }) {
  const { data, loading, error, reload } = useFamily();
  const nav = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    const code = takeReferral();
    if (!code) return;
    void applyReferral({ data: { code } }).then((r) => {
      if (r.applied) {
        setMsg("Doorverwijzing gezet. Fijn dat je via een ander gezin komt.");
        void reload();
      }
    });
  }, [reload]);

  if (loading && !data) {
    return (
      <div className="min-h-dvh">
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Skeleton className="h-10 w-64" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-dvh">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="font-display text-3xl">Ouderzone</h1>
          <p className="mt-3 text-muted">{error || "Kon gegevens niet laden."}</p>
          <Button className="mt-6" onClick={() => void reload()}>
            Opnieuw
          </Button>
        </main>
      </div>
    );
  }

  const { children, entitlement, skills, recent, today, weekMinutes, progress, referralCode, referralCount, hasPin, subscription } = data;
  const childProgress = progress ?? {};
  const canAdd = children.length < entitlement.maxChildren;
  const trialAvailable = !entitlement.premium && !subscription.trialUsed;

  async function run(fn: () => Promise<unknown>, ok?: string) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      await reload();
      if (ok) setMsg(ok);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Mislukt");
    } finally {
      setBusy(false);
    }
  }

  function exportData() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            parent: name,
            ...data,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumi-gegevens-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Bestand gedownload. Dat is jouw kopie.");
  }

  return (
    <div className="min-h-dvh pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted">Welkom, {name}</p>
            <h1 className="font-display text-4xl font-medium tracking-tight">Ouderzone</h1>
          </div>
          <Badge>{entitlement.label}</Badge>
        </div>

        {msg ? <p className="mt-4 text-sm text-ok">{msg}</p> : null}

        {children.length === 0 ? (
          <Card className="mt-8 rounded-xl p-6">
            <Kicker>Eerste stappen</Kicker>
            <h2 className="mt-2 font-display text-2xl">Maak een kindprofiel, zet een code, speel.</h2>
            <ol className="mt-4 grid gap-2 text-sm text-muted">
              <li>1. Kindprofiel — naam, groep, dier.</li>
              <li>2. Oudercode van vier cijfers, zodat een kind niet kan opzeggen.</li>
              <li>3. {trialAvailable ? "30 dagen alle spellen op Plus, of meteen Gezin." : "Kies een plan of speel de drie gratis spellen."}</li>
            </ol>
          </Card>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl p-5">
            <p className="text-sm text-muted">Plan</p>
            <p className="mt-1 font-display text-2xl">{entitlement.label}</p>
            <p className="mt-2 text-sm text-muted">
              {entitlement.premium
                ? `Alle spellen, tot ${entitlement.maxChildren} kinderen.`
                : "3 spellen per dag · 1 kind. Upgrade voor alle spellen."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {!entitlement.premium ? (
                <>
                  {trialAvailable ? (
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => run(() => startTrial(), "Proef van 30 dagen Plus staat aan")}
                    >
                      30 dagen gratis
                    </Button>
                  ) : null}
                  <Button size="sm" variant="secondary" asChild>
                    <Link to="/afrekenen" search={{ plan: "gezin" }}>
                      Gezin {euro(PRICE.gezin)}/mnd
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/afrekenen" search={{ plan: "school" }}>
                      School
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {entitlement.plan !== "plus" && entitlement.plan !== "school" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <Link to="/afrekenen" search={{ plan: "plus" }}>
                        Upgrade naar Plus
                      </Link>
                    </Button>
                  ) : null}
                  {entitlement.plan !== "school" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <Link to="/afrekenen" search={{ plan: "school" }}>
                        School ({euro(PRICE.school)})
                      </Link>
                    </Button>
                  ) : null}
                  {confirmCancel ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={busy}
                        onClick={() => {
                          setConfirmCancel(false);
                          void run(() => cancelPlan(), "Abonnement opgezegd");
                        }}
                      >
                        Ja, opzeggen
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmCancel(false)}>
                        Toch niet
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setConfirmCancel(true)}>
                      Opzeggen
                    </Button>
                  )}
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-faint">
              iDEAL volgt. Tot die tijd activeer je een plan zonder afschrijving. Opzeggen is één tik.
            </p>
          </Card>
          <Card className="rounded-xl p-5">
            <p className="text-sm text-muted">Kinderen</p>
            <p className="mt-1 font-display text-2xl tabular-nums">
              {children.length}/{entitlement.maxChildren}
            </p>
            <p className="mt-2 text-sm text-muted">Elk kind heeft een eigen niveau per spel.</p>
          </Card>
          <Card className="rounded-xl p-5">
            <p className="text-sm text-muted">Deze week</p>
            <p className="mt-1 font-display text-2xl tabular-nums">
              {Object.values(weekMinutes).reduce((a, b) => a + b, 0)} min
            </p>
            <p className="mt-2 text-sm text-muted">{recent.length} sessies opgeslagen.</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4"
              type="button"
              onClick={() => {
                const text = inviteText(window.location.origin, referralCode);
                void navigator.clipboard.writeText(text);
                setMsg("Uitnodiging met jouw code gekopieerd.");
              }}
            >
              Kopieer uitnodiging
            </Button>
            <p className="mt-2 text-xs text-faint">
              Code {referralCode} · {referralCount} gezin{referralCount === 1 ? "" : "nen"} via jou
            </p>
          </Card>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <PinCard hasPin={hasPin} onSaved={() => void reload()} />
          <WeekRapport
            children={children}
            skills={skills}
            weekMinutes={weekMinutes}
            progress={childProgress}
            plus={entitlement.plan === "plus" || entitlement.plan === "school"}
            entitlementGames={entitlement.games}
          />
        </section>

        <Card className="mt-4 rounded-xl p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Beloning</p>
          <p className="mt-2 font-display text-2xl">Geen winkel. Vier lagen.</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Combo in de ronde. Sterren, bekers of eikels erna — in de wereld die zij kiezen. Eén ronde
            houdt de dag vast, de tweede is bonus. Medailles in hun kast. De stof is de prijs; de rest
            is bewijs dat het zit.
          </p>
        </Card>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Kinderen</h2>
            {canAdd ? (
              <Button size="sm" variant="secondary" onClick={() => setShowAdd((v) => !v)}>
                Kind toevoegen
              </Button>
            ) : (
              <Button size="sm" variant="secondary" asChild>
                <Link to="/prijzen">Meer plekken</Link>
              </Button>
            )}
          </div>
          {showAdd || children.length === 0 ? (
            <AddChildForm
              onDone={() => {
                setShowAdd(false);
                void reload();
              }}
            />
          ) : null}
          {entitlement.plan === "school" && canAdd ? (
            <BulkAddForm remaining={entitlement.maxChildren - children.length} onDone={() => void reload()} />
          ) : null}
          {children.length === 0 ? null : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {children.map((c) => {
                const sk = skills[c.id] ?? [];
                const day = today[c.id];
                const remaining = Math.max(0, c.dailyMinutes - (day?.minutes ?? 0));
                const rec = recommendGames(sk, entitlement, 1)[0];
                const recGame = rec ? gameById(rec) : null;
                const prog = childProgress[c.id] ?? emptyProgress();
                const info = levelFromXp(prog.xp);
                const streak = streakFromDays(prog.days);
                return (
                  <Card key={c.id} className="rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <KidAvatar id={c.avatar} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-xl">{c.name}</h3>
                          <select
                            className="h-9 rounded-md border border-border bg-surface px-2 text-xs text-ink"
                            value={c.groupKey}
                            aria-label={`Groep van ${c.name}`}
                            onChange={(e) =>
                              void updateChild({
                                data: { id: c.id, groupKey: e.target.value as GroupKey },
                              }).then(() => reload())
                            }
                          >
                            {GROUPS.map((g) => (
                              <option key={g.key} value={g.key}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <p className="text-sm text-muted">{c.age} jaar</p>
                        <p className="mt-1 text-sm text-ink">
                          Niveau {info.level} · {streak > 0 ? `${streak} dagen op rij` : "nog geen reeks"}
                        </p>
                        <p className="mt-3 text-sm text-muted">
                          Vandaag {day?.minutes ?? 0} / {c.dailyMinutes} min · {day?.plays ?? 0} spellen
                        </p>
                        <Progress
                          className="mt-2"
                          value={Math.min(100, ((day?.minutes ?? 0) / c.dailyMinutes) * 100)}
                        />
                        {recGame ? (
                          <p className="mt-3 text-xs text-muted">
                            Eerst oefenen: {recGame.title}
                          </p>
                        ) : null}
                        <div className="mt-4 grid gap-2">
                          {GAMES.map((g) => {
                            const s = sk.find((x) => x.gameId === g.id);
                            return (
                              <div key={g.id} className="flex items-center justify-between text-sm">
                                <span>{g.title}</span>
                                <span className="tabular-nums text-muted">
                                  {s ? `${s.mastery}% · nv ${s.level}` : "nog niet"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveChildId(c.id);
                              void nav({ to: "/spelen" });
                            }}
                          >
                            Laat {c.name} spelen
                          </Button>
                          <label className="flex items-center gap-2 text-xs text-muted">
                            Tijd
                            <select
                              className="h-9 rounded-md border border-border bg-surface px-2 text-ink"
                              value={c.dailyMinutes}
                              onChange={(e) =>
                                void updateChild({
                                  data: { id: c.id, dailyMinutes: Number(e.target.value) },
                                }).then(() => reload())
                              }
                            >
                              {[10, 15, 20, 30, 45].map((n) => (
                                <option key={n} value={n}>
                                  {n} min
                                </option>
                              ))}
                            </select>
                          </label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (window.confirm(`Profiel van ${c.name} weghalen? Voortgang gaat mee.`)) {
                                void run(() => removeChild({ data: { id: c.id } }), `${c.name} is weg`);
                              }
                            }}
                          >
                            Profiel weg
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-faint">{remaining} minuten over vandaag</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Recente sessies</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nog niets gespeeld. Eerste ronde telt meteen.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-card)]">
              <ul className="divide-y divide-border">
                {recent.slice(0, 12).map((s) => {
                  const child = children.find((c) => c.id === s.childId);
                  const game = gameById(s.gameId);
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="font-medium">{child?.name ?? "Kind"}</span>
                      <span className="text-muted">{game?.title}</span>
                      <span className="tabular-nums text-muted">
                        {s.correct}/{s.attempts} · {s.durationSec}s
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        <section className="mt-16 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Gegevens</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            AVG: je mag een kopie downloaden of alles wissen. Wissen is definitief.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={exportData}>
              Download gegevens
            </Button>
          </div>
          <DeleteAccountBlock />
        </section>
      </main>
    </div>
  );
}

function DeleteAccountBlock() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function wipe() {
    setBusy(true);
    setErr(null);
    try {
      await deleteAccount({ data: { confirm: "VERWIJDER" } });
      await signOut();
      void nav({ to: "/" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Mislukt");
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      {!open ? (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Account verwijderen
        </Button>
      ) : (
        <Card className="rounded-xl p-5">
          <p className="font-medium">Account verwijderen</p>
          <p className="mt-2 text-sm text-muted">
            Kindprofielen, sessies, abonnement en inlog gaan weg. Type VERWIJDER om te bevestigen.
          </p>
          <Input
            className="mt-3 max-w-xs"
            value={typed}
            onChange={(e) => setTyped(e.target.value.toUpperCase())}
            aria-label="Bevestiging"
          />
          {err ? <p className="mt-2 text-sm text-danger">{err}</p> : null}
          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              variant="danger"
              disabled={busy || typed !== "VERWIJDER"}
              onClick={() => void wipe()}
            >
              {busy ? "Bezig…" : "Definitief wissen"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function AddChildForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState(7);
  const [groupKey, setGroupKey] = useState<GroupKey>(groupFromAge(7));
  const [avatar, setAvatar] = useState<AvatarId>("uil");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <Card className="mt-4 rounded-xl p-5">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            await addChild({ data: { name, age, groupKey, avatar } });
            onDone();
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Mislukt");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="cn">Voornaam</Label>
          <Input id="cn" value={name} required maxLength={24} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="age">Leeftijd</Label>
          <Input
            id="age"
            type="number"
            min={4}
            max={12}
            value={age}
            onChange={(e) => {
              const a = Number(e.target.value);
              setAge(a);
              setGroupKey(groupFromAge(a));
            }}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="gr">Groep</Label>
          <select
            id="gr"
            className="h-11 rounded-md border border-border bg-surface px-3"
            value={groupKey}
            onChange={(e) => setGroupKey(e.target.value as GroupKey)}
          >
            {GROUPS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label} ({g.ages})
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Wie ben jij</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAvatar(a.id)}
                className={
                  avatar === a.id
                    ? "rounded-lg ring-2 ring-primary"
                    : "rounded-lg ring-1 ring-border"
                }
              >
                <KidAvatar id={a.id} size={48} />
              </button>
            ))}
          </div>
        </div>
        {err ? <p className="text-sm text-danger sm:col-span-2">{err}</p> : null}
        <Button type="submit" disabled={busy} className="sm:col-span-2">
          Profiel maken
        </Button>
      </form>
    </Card>
  );
}

function BulkAddForm({ remaining, onDone }: { remaining: number; onDone: () => void }) {
  const [raw, setRaw] = useState("");
  const [age, setAge] = useState(8);
  const [groupKey, setGroupKey] = useState<GroupKey>("groep4");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <Card className="mt-4 rounded-xl p-5">
      <p className="font-display text-xl">Klas in één keer</p>
      <p className="mt-1 text-sm text-muted">Eén voornaam per regel. Nog {remaining} plekken.</p>
      <form
        className="mt-4 grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const names = raw
            .split(/\n/)
            .map((n) => n.trim())
            .filter(Boolean)
            .slice(0, remaining);
          if (names.length === 0) return;
          setBusy(true);
          setMsg(null);
          try {
            const r = await addChildrenBulk({ data: { names, age, groupKey } });
            setRaw("");
            setMsg(`${r.added} leerlingen toegevoegd.`);
            onDone();
          } catch (err) {
            setMsg(err instanceof Error ? err.message : "Mislukt");
          } finally {
            setBusy(false);
          }
        }}
      >
        <textarea
          className="min-h-32 rounded-md border border-border bg-surface px-3 py-2 text-sm"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Noor&#10;Sem&#10;Yara"
        />
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">
            Leeftijd
            <Input
              type="number"
              min={4}
              max={12}
              className="mt-1 w-20"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </label>
          <label className="text-xs text-muted">
            Groep
            <select
              className="mt-1 h-11 rounded-md border border-border bg-surface px-3 text-sm text-ink"
              value={groupKey}
              onChange={(e) => setGroupKey(e.target.value as GroupKey)}
            >
              {GROUPS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {msg ? <p className="text-sm text-ok">{msg}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Bezig…" : "Leerlingen toevoegen"}
        </Button>
      </form>
    </Card>
  );
}

function PinCard({ hasPin, onSaved }: { hasPin: boolean; onSaved: () => void }) {
  const [pin, set] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <Card className="rounded-xl p-5">
      <p className="text-sm text-muted">Oudercode</p>
      <p className="mt-1 font-display text-2xl">{hasPin ? "Staat aan" : "Nog niet gezet"}</p>
      <p className="mt-2 text-sm text-muted">
        Vier cijfers. Nodig om vanuit een spel terug te naar de ouderzone. Zodat een kind niet kan opzeggen.
      </p>
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!/^\d{4}$/.test(pin)) {
            setMsg("Precies vier cijfers.");
            return;
          }
          setBusy(true);
          try {
            await setPin({ data: { pin } });
            set("");
            setMsg("Code opgeslagen.");
            onSaved();
          } catch (err) {
            setMsg(err instanceof Error ? err.message : "Mislukt");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Input
          inputMode="numeric"
          maxLength={4}
          value={pin}
          placeholder="••••"
          onChange={(e) => set(e.target.value.replace(/\D/g, "").slice(0, 4))}
          aria-label="Pincode"
        />
        <Button type="submit" size="sm" disabled={busy}>
          {hasPin ? "Wijzig" : "Zet code"}
        </Button>
      </form>
      {msg ? <p className="mt-2 text-xs text-ok">{msg}</p> : null}
    </Card>
  );
}

function WeekRapport({
  children,
  skills,
  weekMinutes,
  progress,
  plus,
  entitlementGames,
}: {
  children: Child[];
  skills: Record<number, Skill[]>;
  weekMinutes: Record<number, number>;
  progress: Record<number, ChildProgress>;
  plus: boolean;
  entitlementGames: import("@/lib/lumi/types").GameId[];
}) {
  return (
    <Card className="rounded-xl p-5" id="rapport">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted">{plus ? "Wekelijks rapport" : "Deze week, kort"}</p>
          <h2 className="mt-1 font-display text-2xl">Voortgang</h2>
        </div>
        <Button size="sm" variant="ghost" type="button" className="print:hidden" onClick={() => window.print()}>
          Print
        </Button>
      </div>
      {children.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Eerst een kindprofiel, dan vullen de minuten zich.</p>
      ) : (
        <ul className="mt-4 grid gap-4">
          {children.map((c) => {
            const sk = skills[c.id] ?? [];
            const rec = recommendGames(sk, { games: entitlementGames } as import("@/lib/lumi/types").Entitlement, 1)[0];
            const game = rec ? gameById(rec) : null;
            const weak = [...sk].sort((a, b) => a.mastery - b.mastery)[0];
            const prog = progress[c.id] ?? emptyProgress();
            const info = levelFromXp(prog.xp);
            const streak = streakFromDays(prog.days);
            const dots = weekDots(prog.days);
            return (
              <li key={c.id} className="text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted">
                  {" "}
                  · {weekMinutes[c.id] ?? 0} min · nv {info.level}
                  {streak > 0 ? ` · ${streak} dagen` : ""}
                </span>
                <ol className="mt-2 flex gap-1" aria-label={`Week van ${c.name}`}>
                  {dots.map((d) => (
                    <li
                      key={d.key}
                      className={`size-2 rounded-full ${d.done ? "bg-primary" : "bg-surface-2"}`}
                      title={d.key}
                    />
                  ))}
                </ol>
                {plus && game ? (
                  <p className="mt-1 text-muted">
                    Eerst oefenen: {game.title}
                    {weak ? ` (${weak.mastery}%)` : ""}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
