import { createFileRoute, Link } from "@tanstack/react-router";
import { PlaySession } from "@/components/play-session";
import { LumiMark } from "@/components/lumi-mark";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { gameById, dutchGameCount } from "@/lib/lumi/catalog";
import { nextRecommended, recommendGames } from "@/lib/lumi/path";
import { canPlayGame } from "@/lib/lumi/pricing";
import type { GameId } from "@/lib/lumi/types";
import { getActiveChildId, useFamily } from "@/lib/lumi/use-family";

type Search = { kind?: number };

export const Route = createFileRoute("/spelen/$gameId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    kind: typeof s.kind === "number" ? s.kind : typeof s.kind === "string" ? Number(s.kind) : undefined,
  }),
  component: GamePage,
});

function GamePage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;
  return <Gate />;
}

function Gate() {
  const { gameId } = Route.useParams();
  const { kind } = Route.useSearch();
  const { data, loading, error, reload } = useFamily();
  const meta = gameById(gameId);

  if (loading && !data) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LumiMark className="size-16" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <p>{error || "Kon het spel niet laden."}</p>
        <Button className="mt-4" onClick={() => void reload()}>
          Opnieuw
        </Button>
      </div>
    );
  }
  if (!meta) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <p>Dit spel bestaat niet.</p>
        <Button className="mt-4" asChild>
          <Link to="/spelen">Terug</Link>
        </Button>
      </div>
    );
  }
  const id = kind ?? getActiveChildId();
  const child = data.children.find((c) => c.id === id) ?? data.children[0];
  if (!child) {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <p>Eerst een kindprofiel in de ouderzone.</p>
        <Button className="mt-4" asChild>
          <Link to="/ouders">Ouderzone</Link>
        </Button>
      </div>
    );
  }
  const today = data.today[child.id];
  if ((today?.minutes ?? 0) >= child.dailyMinutes) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Speeltijd is op</h1>
          <p className="mt-3 text-sm text-muted">Morgen weer een fris hoofd. Of vraag een ouder om de limiet.</p>
          <Button className="mt-6" asChild>
            <Link to="/spelen">Terug</Link>
          </Button>
        </div>
      </div>
    );
  }
  const playCap = data.entitlement.dailyPlays;
  if (playCap != null && (today?.plays ?? 0) >= playCap) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Drie rondes is genoeg voor vandaag</h1>
          <p className="mt-3 text-sm text-muted">Met Gezin speel je onbeperkt verder.</p>
          <Button className="mt-6" asChild>
            <Link to="/ouders">Naar ouderzone</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (!canPlayGame(data.entitlement, meta.id)) {
    return (
      <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">{meta.title} zit in Gezin</h1>
          <p className="mt-3 text-sm text-muted">
            Start de proef van 7 dagen om alle {dutchGameCount()} spellen open te zetten.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/ouders">Naar ouderzone</Link>
          </Button>
        </div>
      </div>
    );
  }
  const level = data.skills[child.id]?.find((s) => s.gameId === (gameId as GameId))?.level ?? 1;
  const rec = recommendGames(data.skills[child.id], data.entitlement, 4);
  const nextGameId = nextRecommended(meta.id, rec);
  const minutesLeft = Math.max(0, child.dailyMinutes - (today?.minutes ?? 0));
  const playCapNow = data.entitlement.dailyPlays;
  const playsLeft = playCapNow == null ? null : Math.max(0, playCapNow - (today?.plays ?? 0));
  return (
    <PlaySession
      gameId={gameId}
      child={child}
      startLevel={level}
      hasPin={data.hasPin}
      nextGameId={nextGameId}
      progress={data.progress?.[child.id]}
      skills={data.skills[child.id]}
      minutesLeft={minutesLeft}
      playsLeft={playsLeft}
    />
  );
}
