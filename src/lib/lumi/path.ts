import { GAMES } from "./catalog";
import type { Entitlement, GameId, Skill } from "./types";

export function recommendGames(
  skills: Skill[] | undefined,
  ent: Entitlement,
  limit = 3,
): GameId[] {
  const map = new Map((skills ?? []).map((s) => [s.gameId, s] as const));
  return [...ent.games]
    .sort((a, b) => {
      const sa = map.get(a);
      const sb = map.get(b);
      const aa = sa?.attempts ?? 0;
      const ba = sb?.attempts ?? 0;
      if (aa === 0 && ba !== 0) return -1;
      if (ba === 0 && aa !== 0) return 1;
      const ma = sa?.mastery ?? 0;
      const mb = sb?.mastery ?? 0;
      if (ma !== mb) return ma - mb;
      return (sa?.level ?? 1) - (sb?.level ?? 1);
    })
    .slice(0, limit);
}

export function nextRecommended(current: GameId, rec: GameId[]): GameId {
  return rec.find((id) => id !== current) ?? GAMES.find((g) => g.id !== current)?.id ?? current;
}

export function starsFromCorrect(correct: number, attempts: number): number {
  if (attempts <= 0) return 1;
  const ratio = correct / attempts;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}
