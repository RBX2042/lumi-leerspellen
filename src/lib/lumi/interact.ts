import type {
  BalanceQuestion,
  BeadsQuestion,
  Beat,
  ClockSetQuestion,
  CoinsQuestion,
  FlipQuestion,
  GridQuestion,
  GroupKey,
  LineQuestion,
  MirrorQuestion,
  OrderQuestion,
  PairTapQuestion,
  PathQuestion,
  PieQuestion,
  Question,
  SortQuestion,
  TilesQuestion,
} from "./types.ts";
import { groupIndex } from "./types.ts";

export { ballon, regen, sprint } from "./arcade.ts";

function rand(n: number): number {
  return Math.floor(Math.random() * n);
}
function pick<T>(arr: readonly T[]): T {
  return arr[rand(arr.length)]!;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
function between(min: number, max: number): number {
  return min + rand(max - min + 1);
}
