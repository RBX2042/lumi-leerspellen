import type { Beat, GameId, GroupKey, Question } from "./types.ts";
import { ballon, regen, sprint } from "./arcade.ts";

export function arcadeQuestion(gameId: GameId, group: GroupKey, level: number, beat: Beat): Question {
  if (gameId === "regen") return regen(group, level, beat);
  if (gameId === "ballon") return ballon(group, level, beat);
  return sprint(group, level, beat);
}
