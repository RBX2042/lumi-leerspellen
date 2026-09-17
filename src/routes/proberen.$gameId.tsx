import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PlaySession } from "@/components/play-session";
import { Button } from "@/components/ui/button";
import { GUEST_CHILD, gameById } from "@/lib/lumi/catalog";
import { isVak, setHomeworkVak } from "@/lib/lumi/curriculum";
import { GROUPS, type GroupKey } from "@/lib/lumi/types";

type Search = { groep?: GroupKey; vak?: string };

export const Route = createFileRoute("/proberen/$gameId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    groep: GROUPS.some((g) => g.key === s.groep) ? (s.groep as GroupKey) : undefined,
    vak: typeof s.vak === "string" ? s.vak : undefined,
  }),
  component: Probeer,
});

function Probeer() {
  const { gameId } = Route.useParams();
  const { groep, vak } = Route.useSearch();
  const meta = gameById(gameId);
  useEffect(() => {
    if (isVak(vak)) setHomeworkVak(vak);
  }, [vak]);
  if (!meta) {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Dit spel bestaat niet</h1>
          <Button className="mt-6" asChild>
            <Link to="/">Terug</Link>
          </Button>
        </div>
      </div>
    );
  }
  const child = groep ? { ...GUEST_CHILD, groupKey: groep } : GUEST_CHILD;
  return (
    <PlaySession
      gameId={meta.id}
      child={child}
      startLevel={3}
      hasPin={false}
      guest
      minutesLeft={20}
    />
  );
}
