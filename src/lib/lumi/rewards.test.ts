import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { levelTitle, questSlots, rankIndex, rankName, roundMark, weekFilled } from "./rewards.ts";

describe("ranks", () => {
  it("names levels by world", () => {
    assert.equal(rankIndex(1), 0);
    assert.equal(rankIndex(3), 1);
    assert.equal(rankIndex(5), 2);
    assert.equal(rankIndex(8), 3);
    assert.equal(rankIndex(12), 4);
    assert.equal(rankName(1, "ster"), "Vonkje");
    assert.equal(rankName(5, "kampioen"), "Kampioen");
    assert.equal(rankName(12, "bos"), "Woud");
    assert.equal(levelTitle(5, "ster"), "Ster 5");
  });
});

describe("marks and quest", () => {
  it("uses world objects, not coins", () => {
    assert.equal(roundMark("ster").many, "sterren");
    assert.equal(roundMark("kampioen").one, "beker");
    assert.equal(roundMark("bos").one, "eikel");
    assert.deepEqual(
      questSlots(0).map((s) => s.filled),
      [false, false],
    );
    assert.deepEqual(
      questSlots(1).map((s) => s.kind),
      ["dag", "bonus"],
    );
    assert.equal(questSlots(1)[0]?.filled, true);
    assert.equal(questSlots(2)[1]?.filled, true);
    assert.equal(weekFilled([{ done: true }, { done: false }, { done: true }]), 2);
  });
});
