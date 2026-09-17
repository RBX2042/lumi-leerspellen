import type { Question } from "./types.ts";
import { centsLabel, formatSpoken } from "./interact-util.ts";

export { centsLabel, formatSpoken, canTraceWord } from "./interact-util.ts";
export { maak10, sprong, stapel, bakken, kassa, draai, clockSet, honderd } from "./interact-a.ts";
export { taart, kralen, rij, jacht, weeg, spiegel, zin } from "./interact-b.ts";
export { ballon, regen, sprint } from "./arcade.ts";

export function isPlayBoard(q: Question): boolean {
  return (
    q.kind === "line" ||
    q.kind === "tiles" ||
    q.kind === "clockset" ||
    q.kind === "sort" ||
    q.kind === "pairtap" ||
    q.kind === "coins" ||
    q.kind === "flip" ||
    q.kind === "grid" ||
    q.kind === "pie" ||
    q.kind === "beads" ||
    q.kind === "order" ||
    q.kind === "path" ||
    q.kind === "balance" ||
    q.kind === "mirror" ||
    q.kind === "catch" ||
    q.kind === "float" ||
    q.kind === "dash" ||
    q.kind === "tap"
  );
}

export function answerLabel(q: Question): string | undefined {
  if (q.kind === "choice") return q.choices[q.answer];
  if (q.kind === "tap") return q.answer;
  if (q.kind === "line") return String(q.answer);
  if (q.kind === "tiles") return q.word;
  if (q.kind === "clockset") return formatSpoken(q.hours, q.minutes);
  if (q.kind === "sort") return `${q.left.label} / ${q.right.label}`;
  if (q.kind === "pairtap") return String(q.target);
  if (q.kind === "coins") return centsLabel(q.target);
  if (q.kind === "flip") return "alle paren";
  if (q.kind === "grid") return String(q.answer);
  if (q.kind === "pie") return `${q.need}/${q.slices}`;
  if (q.kind === "beads") return String(q.target);
  if (q.kind === "order") return q.answer.map((id) => q.items.find((it) => it.id === id)?.label ?? id).join(" ");
  if (q.kind === "path") return q.word;
  if (q.kind === "balance") return String(q.left);
  if (q.kind === "mirror") return "spiegelbeeld";
  if (q.kind === "catch") return String(q.target);
  if (q.kind === "float") return q.target;
  if (q.kind === "dash") return q.chips.find((c) => c.ok)?.label ?? q.goal;
  return undefined;
}
