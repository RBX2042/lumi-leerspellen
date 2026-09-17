import type { Beat, CatchQuestion, DashQuestion, FloatQuestion, GroupKey } from "./types.ts";
import { groupIndex } from "./types.ts";

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

export function regen(group: GroupKey, _level: number, beat: Beat): CatchQuestion {
  const g = groupIndex(group);
  let max = 10;
  if (g <= 1) max = 8;
  else if (g === 2) max = 12;
  else if (g <= 4) max = beat === "boss" ? 30 : 20;
  else max = beat === "boss" ? 100 : 50;
  const target = between(1, max);
  const fallers = [target];
  let guard = 0;
  while (fallers.length < (beat === "warmup" ? 4 : 6) && guard < 40) {
    guard += 1;
    const n = between(1, max);
    if (!fallers.includes(n)) fallers.push(n);
  }
  const seconds = beat === "boss" ? 3.2 : beat === "warmup" ? 5.2 : 4.2;
  return {
    kind: "catch",
    prompt: `Tik ${target} voordat hij valt`,
    setup: "Getallen vallen. Tik alleen het goede.",
    target,
    fallers: shuffle(fallers),
    seconds,
    teach: `Je zoekt ${target}. De rest laat je vallen. Kijk eerst, dan tik.`,
    hint: `Het getal is ${target}. Niet de buren.`,
    tag: String(target),
  };
}

export function ballon(group: GroupKey, _level: number, beat: Beat): FloatQuestion {
  const g = groupIndex(group);
  let max = 10;
  if (g <= 1) max = 8;
  else if (g === 2) max = 12;
  else if (g <= 4) max = beat === "boss" ? 40 : 20;
  else max = beat === "boss" ? 100 : 50;
  const target = String(between(1, max));
  const floaters = [target];
  let guard = 0;
  while (floaters.length < (beat === "warmup" ? 4 : 5) && guard < 40) {
    guard += 1;
    const n = String(between(1, max));
    if (!floaters.includes(n)) floaters.push(n);
  }
  const seconds = beat === "boss" ? 3.6 : beat === "warmup" ? 5.6 : 4.6;
  return {
    kind: "float",
    prompt: `Prik ${target} voor hij weg is`,
    setup: "Ballonnen stijgen. Tik alleen de goede.",
    target,
    floaters: shuffle(floaters),
    seconds,
    teach: `Je zoekt ${target}. De andere ballonnen laat je gaan.`,
    hint: `Het getal is ${target}. Kijk eerst, dan prik.`,
    tag: target,
  };
}

export function sprint(group: GroupKey, _level: number, beat: Beat): DashQuestion {
  const g = groupIndex(group);
  let a: number;
  let b: number;
  let op: "×" | "+" | "−";
  let answer: number;
  if (g <= 2) {
    op = "+";
    a = between(1, g <= 1 ? 6 : 9);
    b = between(1, g <= 1 ? 6 : 9);
    answer = a + b;
  } else if (g <= 4 || beat === "warmup") {
    if (rand(2) === 0) {
      op = "+";
      a = between(6, 20);
      b = between(2, 12);
      answer = a + b;
    } else {
      op = "−";
      a = between(8, 20);
      b = between(2, Math.min(9, a - 1));
      answer = a - b;
    }
  } else {
    op = "×";
    a = between(2, 10);
    b = between(2, beat === "boss" ? 10 : 8);
    answer = a * b;
  }
  const labels = [String(answer)];
  let guard = 0;
  while (labels.length < 5 && guard < 50) {
    guard += 1;
    const delta = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const n = Math.max(0, answer + delta);
    const s = String(n);
    if (!labels.includes(s)) labels.push(s);
  }
  const chips = shuffle(labels.map((label) => ({ label, ok: label === String(answer) })));
  const seconds = beat === "boss" ? 3.4 : beat === "warmup" ? 6 : 4.6;
  const goal = `${a} ${op} ${b}`;
  return {
    kind: "dash",
    prompt: `Tik het antwoord op ${goal}`,
    setup: "De som blijft staan. De antwoorden springen. Tik het goede.",
    goal,
    chips,
    seconds,
    teach: `${goal} is ${answer}. Reken eerst, dan tik — niet het getal dat het hardst springt.`,
    hint: `Reken ${goal} uit. Het antwoord is ${answer}.`,
    tag: goal,
  };
}
