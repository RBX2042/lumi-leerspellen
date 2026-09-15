import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  earnedBadges,
  levelFromXp,
  newBadges,
  roundXp,
  starTrackLine,
  streakFromDays,
  weekDots,
  xpCost,
  xpForHit,
  xpToReach,
} from "./loop.ts";

describe("xp curve", () => {
  it("lets the first round almost always level up", () => {
    assert.equal(xpToReach(1), 0);
    assert.equal(xpCost(1), 40);
    assert.equal(xpToReach(2), 40);
    const afterFirst = levelFromXp(100);
    assert.ok(afterFirst.level >= 2);
  });

  it("slows down without stalling", () => {
    assert.equal(xpCost(5), 120);
    assert.ok(xpToReach(10) > xpToReach(5));
    assert.equal(levelFromXp(0).level, 1);
    assert.equal(levelFromXp(39).level, 1);
    assert.equal(levelFromXp(40).level, 2);
  });
});

describe("round xp", () => {
  it("pays combo and a perfect bonus", () => {
    assert.equal(xpForHit(1), 10);
    assert.equal(xpForHit(5), 18);
    assert.ok(roundXp(10, 10, 10) > roundXp(8, 10, 3));
    assert.equal(roundXp(10, 10, 10) - roundXp(10, 10, 2), 40);
  });
});

describe("streak and week", () => {
  it("counts back from today or yesterday", () => {
    const now = new Date("2026-09-15T12:00:00Z");
    assert.equal(streakFromDays(["2026-09-15", "2026-09-14", "2026-09-13"], now), 3);
    assert.equal(streakFromDays(["2026-09-14", "2026-09-13"], now), 2);
    assert.equal(streakFromDays(["2026-09-10"], now), 0);
  });

  it("fills Monday to Sunday", () => {
    const now = new Date("2026-09-15T12:00:00Z"); // Tuesday
    const dots = weekDots(["2026-09-14", "2026-09-15"], now);
    assert.equal(dots.length, 7);
    assert.equal(dots[0]?.label, "M");
    assert.equal(dots[1]?.done, true);
    assert.equal(dots[1]?.today, true);
    assert.equal(dots[0]?.done, true);
  });
});

describe("badges", () => {
  it("unlocks in order and diffs new ones", () => {
    const before = earnedBadges({
      plays: 0,
      perfects: 0,
      bestCombo: 0,
      streakDays: 0,
      threeStars: false,
      masteryHigh: false,
      gamesPlayed: 0,
      level: 1,
    });
    assert.deepEqual(before, []);
    const after = earnedBadges({
      plays: 1,
      perfects: 1,
      bestCombo: 8,
      streakDays: 3,
      threeStars: true,
      masteryHigh: false,
      gamesPlayed: 1,
      level: 2,
    });
    assert.ok(after.includes("eerste"));
    assert.ok(after.includes("perfect"));
    assert.ok(after.includes("combo8"));
    assert.ok(after.includes("dagen3"));
    assert.deepEqual(newBadges(["eerste"], after).filter((id) => id === "eerste"), []);
    assert.ok(newBadges(["eerste"], after).includes("perfect"));
  });
});

describe("star track", () => {
  it("tightens copy near the end of a clean round", () => {
    assert.equal(starTrackLine(2, 2, 8), null);
    assert.match(starTrackLine(7, 7, 2)!, /hou de reeks/i);
  });
});
