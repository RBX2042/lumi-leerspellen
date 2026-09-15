import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  beatForIndex,
  beatLevel,
  briefing,
  comboLine,
  continueLine,
  defaultHint,
  feedbackLine,
  hintDelayMs,
  nearMissLine,
  recapLine,
} from "./coach.ts";
import { makeQuestion } from "./questions.ts";
import { ALL_GAMES } from "./catalog.ts";
import { GAME_ID_LIST } from "./types.ts";

describe("round beats", () => {
  it("warms up, then cores, then bosses the last two", () => {
    assert.equal(beatForIndex(0), "warmup");
    assert.equal(beatForIndex(1), "warmup");
    assert.equal(beatForIndex(4), "core");
    assert.equal(beatForIndex(8), "boss");
    assert.equal(beatForIndex(9), "boss");
  });

  it("eases warmup and stretches the boss", () => {
    assert.equal(beatLevel(4, "warmup"), 3);
    assert.equal(beatLevel(4, "core"), 4);
    assert.equal(beatLevel(4, "boss"), 5);
    assert.equal(beatLevel(1, "warmup"), 1);
    assert.equal(beatLevel(12, "boss"), 12);
  });

  it("gives think-time before a tip, except on warmup", () => {
    assert.equal(hintDelayMs("warmup"), 0);
    assert.equal(hintDelayMs("core"), 6000);
    assert.equal(hintDelayMs("boss"), 10000);
  });
});

describe("explanations", () => {
  it("teaches on a hit instead of empty praise", () => {
    const line = feedbackLine({ ok: true, teach: "Begin bij 8. Tel 2 verder: 9, 10." });
    assert.match(line, /Ja/);
    assert.match(line, /Begin bij 8/);
    assert.doesNotMatch(line, /goed zo/i);
  });

  it("contrasts a near miss instead of saying fout", () => {
    const line = feedbackLine({
      ok: false,
      teach: "Begin bij 8. Tel 2 verder: 9, 10.",
      picked: "11",
      correct: "10",
    });
    assert.match(line, /Bijna/);
    assert.match(line, /één te veel/);
    assert.doesNotMatch(line, /\bfout\b/i);
  });

  it("names a broken streak so the round stays tense", () => {
    const line = feedbackLine({
      ok: false,
      teach: "Kijk.",
      picked: "x",
      correct: "y",
      lostStreak: 4,
    });
    assert.match(line, /reeks van 4/);
  });

  it("seals a repaired item", () => {
    const line = feedbackLine({ ok: true, teach: "ei van trein.", wasRetry: true });
    assert.match(line, /Nu zit hij/);
  });
});

describe("comeback", () => {
  it("hooks a near-miss on two stars", () => {
    const line = nearMissLine(8, 10);
    assert.ok(line);
    assert.match(line!, /drie sterren/);
  });

  it("asks them to say tags aloud", () => {
    const line = recapLine(["trein", "tijd", "ei"], 9, 10, 0);
    assert.match(line, /hardop/);
  });

  it("keeps the last questions as the test", () => {
    assert.equal(continueLine(7, 10, true), "Nog twee. Let op");
    assert.equal(continueLine(8, 10, true), "De laatste");
    assert.equal(continueLine(3, 10, false), "Ik snap het");
  });
});

describe("questions always teach", () => {
  it("ships a hint and a teach line for every game", () => {
    assert.equal(ALL_GAMES.length, GAME_ID_LIST.length);
    for (const id of ALL_GAMES) {
      const q = makeQuestion(id, "groep4", 4, "core");
      assert.ok(q.teach && q.teach.length > 8, `${id} missing teach`);
      assert.ok(q.hint && q.hint.length > 8, `${id} missing hint`);
      assert.ok(defaultHint(id).length > 8);
    }
  });

  it("briefs the child with a strategy, not a lecture", () => {
    const b = briefing("rekenpad", 3, "Noor", ["8 + 2"]);
    assert.match(b.body, /laatste twee/);
    assert.match(b.tip, /grootste getal/i);
    assert.match(b.body, /8 \+ 2/);
  });
});

describe("combo copy", () => {
  it("stays quiet until a streak exists", () => {
    assert.equal(comboLine(1), null);
    assert.match(comboLine(3)!, /hou vol/i);
    assert.match(comboLine(8)!, /Flow/);
  });
});
