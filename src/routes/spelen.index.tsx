import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { BadgeRow, StreakRing, WeekStrip, XpBar } from "@/components/habit-bits";
import { KidAvatar } from "@/components/kid-avatar";
import { Kicker } from "@/components/kicker";
import { LumiMark } from "@/components/lumi-mark";
import { ParentLink } from "@/components/parent-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { comebackLine } from "@/lib/lumi/coach";
import { GAMES, TONE_BAR, TONE_TEXT } from "@/lib/lumi/catalog";
import {
  badgesFromProgress,
  dailyQuest,
  emptyProgress,
  levelFromXp,
  loadHabit,
  playedOn,
  streakFromDays,
  weekDots,
} from "@/lib/lumi/loop";
import { recommendGames } from "@/lib/lumi/path";
import { canPlayGame } from "@/lib/lumi/pricing";
import type { Child, GameId } from "@/lib/lumi/types";
import { getActiveChildId, setActiveChildId, useFamily } from "@/lib/lumi/use-family";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spelen/")({ component: Spelen });

function Spelen() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;
  return <KidHub />;
}

function KidHub() {
  const { data, loading, error, reload } = useFamily();
  const [childId, setChildId] = useState<number | null>(null);

  const [habitCombo, setHabitCombo] = useState(0);

  useEffect(() => {
    setChildId(getActiveChildId());
  }, []);

  useEffect(() => {
    if (!data) return;
    const id = childId ?? data.children[0]?.id;
    if (id == null) return;
    setHabitCombo(loadHabit(id).bestCombo);
  }, [childId, data]);

  if (loading && !data) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LumiMark className="size-16" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <LumiMark className="mx-auto size-14" />
          <h1 className="mt-4 font-display text-3xl">Even mis</h1>
          <p className="mt-2 text-sm text-muted">{error || "Kon je spellen niet laden."}</p>
          <Button className="mt-6" onClick={() => void reload()}>
            Opnieuw
          </Button>
        </div>
      </div>
    );
  }

  const child = data.children.find((c) => c.id === childId) ?? data.children[0];
  if (!child) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <LumiMark className="mx-auto size-14" />
          <h1 className="mt-4 font-display text-3xl">Eerst een kindprofiel</h1>
          <p className="mt-2 text-sm text-muted">
            Een ouder maakt het profiel. Daarna mag jij spelen.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/ouders">Naar ouderzone</Link>
          </Button>
        </div>
      </div>
    );
  }

  const today = data.today[child.id];
  const timeUp = (today?.minutes ?? 0) >= child.dailyMinutes;
  const playCap = data.entitlement.dailyPlays;
  const playsLeft = playCap == null ? null : Math.max(0, playCap - (today?.plays ?? 0));
  const capped = playsLeft === 0;
  const rec = recommendGames(data.skills[child.id], data.entitlement, 3);
  const recMeta = rec.map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
  const prog = data.progress?.[child.id] ?? emptyProgress();
  const days = streakFromDays(prog.days);
  const todayDone = playedOn(prog.days);
  const atRisk = days > 0 && !todayDone;
  const info = levelFromXp(prog.xp);
  const dots = weekDots(prog.days);
  const badges = badgesFromProgress(prog, data.skills[child.id], { bestCombo: habitCombo });
  const quest = dailyQuest(today?.plays ?? 0);
  const mission = recMeta[0];

  return (
    <div className="min-h-dvh bg-bg pb-16">
      <header className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <KidAvatar id={child.avatar} size={44} />
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">{child.name}</p>
            <p className="truncate text-xs text-muted">
              {atRisk
                ? `${days} dagen op rij staat op het spel`
                : days > 0
                  ? `Dag ${days} op rij · niveau ${info.level}`
                  : `Niveau ${info.level} · ${comebackLine(days, todayDone)}`}
            </p>
          </div>
        </div>
        <ParentLink
          to="/ouders"
          hasPin={data.hasPin}
          className="inline-flex h-11 shrink-0 items-center text-sm text-muted hover:text-ink"
        >
          Stoppen
        </ParentLink>
      </header>

      {data.children.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {data.children.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveChildId(c.id);
                setChildId(c.id);
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm",
                c.id === child.id ? "bg-primary text-primary-fg" : "bg-surface",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      ) : null}

      <main className="mx-auto max-w-3xl px-4 pt-4">
        <Card className="mb-5 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <StreakRing days={days} atRisk={atRisk} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl">
                {atRisk ? "Houd je reeks vast" : todayDone ? "Dag zit" : "Start de reeks"}
              </p>
              <p className="mt-0.5 text-sm text-muted">{quest.line}</p>
            </div>
          </div>
          <div className="mt-4">
            <WeekStrip dots={dots} />
          </div>
          <XpBar className="mt-4" info={info} />
          {badges.length > 0 ? (
            <div className="mt-4">
              <BadgeRow ids={badges} />
            </div>
          ) : null}
        </Card>

        {timeUp || capped ? (
          <Card className="mb-6 rounded-2xl p-5">
            <p className="font-display text-xl">Klaar voor vandaag</p>
            <p className="mt-1 text-sm text-muted">
              {timeUp
                ? "De speeltijd is op. Morgen weer een fris hoofd — dan blijft het zitten."
                : "De drie gratis spellen van vandaag zijn op. Met Gezin speel je verder."}
            </p>
            {!data.entitlement.premium ? (
              <Button className="mt-4" asChild>
                <Link to="/prijzen">Naar Gezin</Link>
              </Button>
            ) : null}
          </Card>
        ) : mission ? (
          <Card className="relative mb-6 overflow-hidden rounded-2xl p-5">
            <span className={cn("absolute inset-y-0 left-0 w-1", TONE_BAR[mission.tone])} />
            <div className="pl-2">
              <Kicker>Opdracht van vandaag</Kicker>
              <p className="mt-1 font-display text-2xl">{mission.title}</p>
              <p className="mt-1 text-sm text-muted">{mission.mission}. Tien vragen. De laatste twee zijn de test.</p>
              <p className="mt-2 text-sm text-ink">
                {atRisk ? `${days} dagen op rij. Eén ronde houdt het vast.` : comebackLine(days, todayDone)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild>
                  <Link
                    to="/spelen/$gameId"
                    params={{ gameId: mission.id }}
                    search={{ kind: child.id }}
                    onClick={() => setActiveChildId(child.id)}
                  >
                    {todayDone ? "Nog een ronde" : "Start de opdracht"}
                  </Link>
                </Button>
                {todayDone && !timeUp && !capped ? (
                  <p className="w-full text-xs text-faint">De dag zit. Extra ronde zet het nóg vaster.</p>
                ) : null}
                {recMeta.slice(1).map((g) =>
                  g ? (
                    <Button key={g.id} size="sm" variant="secondary" asChild>
                      <Link
                        to="/spelen/$gameId"
                        params={{ gameId: g.id }}
                        search={{ kind: child.id }}
                        onClick={() => setActiveChildId(child.id)}
                      >
                        {g.title}
                      </Link>
                    </Button>
                  ) : null,
                )}
              </div>
            </div>
          </Card>
        ) : null}

        <h1 className="font-display text-3xl">Kies een spel</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => {
            const open = canPlayGame(data.entitlement, g.id as GameId) && !timeUp && !capped;
            const skill = data.skills[child.id]?.find((s) => s.gameId === g.id);
            return (
              <GameCard
                key={g.id}
                game={g}
                child={child}
                locked={!open}
                mastery={skill?.mastery}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

function GameCard({
  game,
  child,
  locked,
  mastery,
}: {
  game: (typeof GAMES)[number];
  child: Child;
  locked: boolean;
  mastery?: number;
}) {
  const inner = (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 transition-[transform] duration-150",
        !locked && "hover:-translate-y-0.5",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", TONE_BAR[game.tone])} />
      <div className="flex items-start justify-between pl-2">
        <p className={cn("text-xs font-medium uppercase tracking-wider", TONE_TEXT[game.tone])}>{game.subject}</p>
        {locked ? <Lock className="size-4 text-faint" /> : <Badge variant="muted">{game.minutes}</Badge>}
      </div>
      <h2 className="mt-2 pl-2 font-display text-2xl">{game.title}</h2>
      <p className="mt-2 pl-2 text-sm text-muted">{game.blurb}</p>
      {mastery != null ? (
        <p className="mt-3 pl-2 text-xs tabular-nums text-faint">{mastery}% vast</p>
      ) : null}
    </Card>
  );
  if (locked) return <div className="opacity-70">{inner}</div>;
  return (
    <Link
      to="/spelen/$gameId"
      params={{ gameId: game.id }}
      search={{ kind: child.id }}
      onClick={() => setActiveChildId(child.id)}
    >
      {inner}
    </Link>
  );
}
