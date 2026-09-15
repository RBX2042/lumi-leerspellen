import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { makeQuestion } from "./questions.ts";
import { ALL_GAMES, GAMES } from "./catalog.ts";
import {
  answerLabel,
  canTraceWord,
  centsLabel,
  honderd,
  isPlayBoard,
  jacht,
  kralen,
  maak10,
  sprong,
  stapel,
  taart,
  weeg,
} from "./interact.ts";
import { GAME_ID_LIST, type GameId } from "./types.ts";

const interactive: GameId[] = [
  "maak10",
  "sprong",
  "stapel",
  "bakken",
  "kassa",
  "draai",
  "honderd",
  "taart",
  "kralen",
  "rij",
  "jacht",
  "weeg",
  "spiegel",
  "zin",
];

describe("interactive games", () => {
  it("ships a board question with hint and teach", () => {
    for (const id of interactive) {
      const q = makeQuestion(id, "groep4", 4, "core");
      assert.ok(isPlayBoard(q), `${id} should be a board`);
      assert.ok(q.teach && q.teach.length > 8, `${id} missing teach`);
      assert.ok(q.hint && q.hint.length > 8, `${id} missing hint`);
      assert.ok(answerLabel(q));
    }
  });

  it("klokkijken becomes a set-the-clock board after warmup", () => {
    const warm = makeQuestion("klokkijken", "groep4", 4, "warmup");
    assert.equal(warm.kind, "choice");
    const core = makeQuestion("klokkijken", "groep4", 4, "core");
    assert.equal(core.kind, "clockset");
  });

  it("maaktien always has a pair that sums to the target", () => {
    for (const group of ["groep1", "groep3", "groep5", "groep8"] as const) {
      for (const beat of ["warmup", "core", "boss"] as const) {
        for (let i = 0; i < 30; i++) {
          const q = maak10(group, 3, beat);
          const ok = q.numbers.some((a, i1) => q.numbers.some((b, i2) => i1 !== i2 && a + b === q.target));
          assert.ok(ok, `no pair for ${q.target} in ${q.numbers.join(",")} (${group} ${beat})`);
          assert.equal(q.numbers.length, 6);
        }
      }
    }
  });

  it("sprong lands on the line", () => {
    const q = sprong("groep2", 2, "core");
    assert.ok(q.answer >= q.min && q.answer <= q.max);
    assert.equal((q.answer - q.min) % q.step, 0);
  });

  it("stapel tiles contain every letter of the word", () => {
    const q = stapel("groep2", 2, "core");
    for (const ch of q.word) {
      assert.ok(q.tiles.filter((t) => t === ch).length >= [...q.word].filter((c) => c === ch).length);
    }
  });

  it("formats cents in Dutch", () => {
    assert.equal(centsLabel(100), "€1");
    assert.equal(centsLabel(135), "€1,35");
    assert.equal(centsLabel(5), "€0,05");
  });

  it("honderdveld puts the answer on the grid", () => {
    for (let i = 0; i < 20; i++) {
      const q = honderd("groep4", 4, "core");
      assert.ok(q.cells.includes(q.answer));
    }
  });

  it("honderdveld names the last digit, not ten", () => {
    for (let i = 0; i < 40; i++) {
      const q = honderd("groep6", 6, "core");
      if (q.cols !== 10) continue;
      const ones = q.answer % 10;
      assert.ok(q.teach?.includes(`Laatste cijfer is ${ones}`), q.teach);
    }
  });

  it("taartstuk never asks more slices than exist", () => {
    for (let i = 0; i < 20; i++) {
      const q = taart("groep5", 5, "core");
      assert.ok(q.need >= 1 && q.need <= q.slices);
    }
  });

  it("kralenrek stays on the rack", () => {
    const q = kralen("groep3", 3, "core");
    assert.ok(q.target >= 1 && q.target <= q.rows * 10);
  });

  it("letterjacht can be traced", () => {
    for (const group of ["groep3", "groep6", "groep8"] as const) {
      for (let i = 0; i < 20; i++) {
        const q = jacht(group, 6, i % 2 === 0 ? "core" : "boss");
        assert.ok(canTraceWord(q.letters, q.cols, q.word), `cannot trace ${q.word} on ${q.cols} (${group})`);
      }
    }
  });

  it("weegschaal can be balanced with the given weights", () => {
    for (let i = 0; i < 20; i++) {
      const q = weeg("groep4", 4, "core");
      const dens = q.weights;
      const can = (left: number, i0: number): boolean => {
        if (left === 0) return true;
        if (left < 0 || i0 >= 8) return false;
        for (const w of dens) {
          if (can(left - w, i0 + 1)) return true;
        }
        return false;
      };
      assert.ok(can(q.left, 0), `cannot make ${q.left} from ${dens.join(",")}`);
    }
  });
});

describe("catalog", () => {
  it("keeps GAME_ID_LIST in lockstep with GAMES", () => {
    assert.deepEqual(
      GAMES.map((g) => g.id),
      [...GAME_ID_LIST],
    );
    assert.deepEqual(ALL_GAMES, [...GAME_ID_LIST]);
  });
});
