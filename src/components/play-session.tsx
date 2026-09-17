import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Volume2, VolumeX } from "lucide-react";
import { PlayBoard, answerLabel, isPlayBoard } from "@/components/play-root";
import { BadgeMark, ComboHud, Confetti, RoundStars, XpBar, XpPops } from "@/components/habit-bits";
import { Kicker } from "@/components/kicker";
import { GameVisual, MemoryBoard } from "@/components/game-visuals";
import { ParentLink } from "@/components/parent-gate";
import { Button } from "@/components/ui/button";
import {
  beatForIndex,
  beatLevel,
  beatLine,
  briefing,
  comboLine,
  continueLine,
  feedbackLine,
  hintDelayMs,
  loadLoop,
  nearMissLine,
  recapLine,
  saveLoop,
  tomorrowHook,
} from "@/lib/lumi/coach";
import {
  isMuted,
  playBadge,
  playCombo,
  playCorrect,
  playLevelUp,
  playStar,
  playTap,
  playTick,
  playWin,
  playWrong,
  setMuted,
  tapHaptic,
  unlockAudio,
} from "@/lib/lumi/audio";
import { gameById, gameArt } from "@/lib/lumi/catalog";
import {
  badgesFromProgress,
  badgeTitle,
  continueHook,
  levelFromXp,
  loadHabit,
  loadWorld,
  newBadges,
  reducedMotion,
  roundXp,
  saveHabit,
  starTrackLine,
  streakFromDays,
  todayKey,
  xpForHit,
  type BadgeId,
} from "@/lib/lumi/loop";
import { makeQuestion, nextLevel, reshuffle } from "@/lib/lumi/questions";
import { recordSession } from "@/lib/lumi/server";
import { starsFromCorrect } from "@/lib/lumi/path";
import { levelTitle } from "@/lib/lumi/rewards";
import type { Beat, Child, ChildProgress, GameId, Question, Skill } from "@/lib/lumi/types";
import { cn } from "@/lib/utils";

const ROUND = 10;
const NEXT_SEC = 8;

function newMemorySeq(len: number, size: number): number[] {
  return Array.from({ length: len }, () => Math.floor(Math.random() * size));
}

function firstQuestion(gameId: GameId, group: Child["groupKey"], startLevel: number): Question {
  const beat: Beat = "warmup";
  return makeQuestion(gameId, group, beatLevel(startLevel, beat), beat);
}

export function PlaySession({
  gameId,
  child,
  startLevel,
  hasPin,
  nextGameId,
  progress,
  skills,
  minutesLeft = 20,
  playsLeft = null,
  guest = false,
}: {
  gameId: string;
  child: Child;
  startLevel: number;
  hasPin: boolean;
  nextGameId?: GameId;
  progress?: ChildProgress;
  skills?: Skill[];
  minutesLeft?: number;
  playsLeft?: number | null;
  guest?: boolean;
}) {
  const gid = gameId as GameId;
  const isMemory = gid === "geheugen";
  const meta = gameById(gameId);
  const started = useRef(Date.now());
  const retry = useRef<Question[]>([]);
  const sinceRetry = useRef(0);
  const lock = useRef(false);
  const popSeq = useRef(0);
  const skipBrief = useRef(false);
  const spentMin = useRef(0);
  const extraRounds = useRef(0);
  const boardLock = useRef(false);
  const [level, setLevel] = useState(startLevel);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [repaired, setRepaired] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<"brief" | "ask" | "feedback">("brief");
  const [lastOk, setLastOk] = useState(false);
  const [wasRetry, setWasRetry] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [missStreak, setMissStreak] = useState(0);
  const [mute, setMute] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [juice, setJuice] = useState<"pop" | "shake" | null>(null);
  const [hintReady, setHintReady] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [pickedText, setPickedText] = useState<string | undefined>(undefined);
  const [priorTags, setPriorTags] = useState<string[]>([]);
  const [bestCombo, setBestCombo] = useState(0);
  const [gained, setGained] = useState(0);
  const [pops, setPops] = useState<{ id: number; n: number }[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState<BadgeId[]>([]);
  const [leveledTo, setLeveledTo] = useState<number | null>(null);

  useEffect(() => {
    setMute(isMuted());
    setPriorTags(loadLoop(child.id, gid)?.tags ?? []);
  }, [child.id, gid]);

  const [q, setQ] = useState<Question>(() => firstQuestion(gid, child.groupKey, startLevel));
  const beat = beatForIndex(index, ROUND);

  const resetRound = (brief: boolean) => {
    started.current = Date.now();
    retry.current = [];
    sinceRetry.current = 0;
    lock.current = false;
    boardLock.current = false;
    skipBrief.current = !brief;
    if (!brief) extraRounds.current += 1;
    setQ(firstQuestion(gid, child.groupKey, startLevel));
    setPhase(brief ? "brief" : "ask");
    setPicked(null);
    setPickedText(undefined);
    setIndex(0);
    setCorrect(0);
    setAttempts(0);
    setRepaired(0);
    setDone(false);
    setWinStreak(0);
    setMissStreak(0);
    setTags([]);
    setJuice(null);
    setBestCombo(0);
    setGained(0);
    setPops([]);
    setCount(null);
    setUnlocked([]);
    setLeveledTo(null);
    setLastOk(false);
    setWasRetry(false);
  };

  useEffect(() => {
    resetRound(true);
    // New game or child — start from the briefing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, child.groupKey, startLevel]);

  const memLen = isMemory ? Math.min(6, 2 + Math.floor(level / 2) + (beat === "boss" ? 1 : 0)) : 0;
  const memSize = isMemory ? (level >= 6 || beat === "boss" ? 9 : 4) : 4;
  const [seq, setSeq] = useState<number[]>(() => (isMemory ? newMemorySeq(2, 4) : []));
  const [memPhase, setMemPhase] = useState<"watch" | "play">("watch");
  const [active, setActive] = useState<number | null>(null);
  const [progressMem, setProgressMem] = useState(0);
  const [lit, setLit] = useState<number[]>([]);

  useEffect(() => {
    if (!isMemory || done || phase !== "ask") return;
    const s = newMemorySeq(memLen, memSize);
    setSeq(s);
    setMemPhase("watch");
    setProgressMem(0);
    setLit([]);
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i >= s.length) {
        setActive(null);
        setMemPhase("play");
        return;
      }
      setActive(s[i]!);
      window.setTimeout(() => {
        setActive(null);
        i += 1;
        window.setTimeout(tick, 280);
      }, 520);
    };
    const t = window.setTimeout(tick, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [isMemory, index, memLen, memSize, done, phase]);

  useEffect(() => {
    if (phase !== "ask" || done) {
      setHintReady(false);
      setHintOpen(false);
      return;
    }
    const delay = hintDelayMs(beat);
    if (delay === 0) {
      setHintReady(true);
      setHintOpen(true);
      return;
    }
    setHintReady(false);
    setHintOpen(false);
    const t = window.setTimeout(() => setHintReady(true), delay);
    return () => window.clearTimeout(t);
  }, [phase, index, done, beat]);

  const spawnXp = (n: number) => {
    const id = ++popSeq.current;
    setPops((p) => [...p, { id, n }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 780);
  };

  const usedMin = () => Math.max(1, Math.round((Date.now() - started.current) / 1000 / 60));
  const anotherOk = () => {
    const timeOk = minutesLeft - spentMin.current - usedMin() >= 5;
    const playOk = playsLeft == null || playsLeft - extraRounds.current > 1;
    return timeOk && playOk;
  };

  const finish = async (c: number, a: number, lvl: number, learned: string[], combo: number) => {
    setDone(true);
    playWin();
    setSaving(true);
    spentMin.current += usedMin();
    saveLoop(child.id, gid, learned, lvl);
    const xp = roundXp(c, a, combo);
    setGained(xp);
    const priorXp = progress?.xp ?? 0;
    const before = levelFromXp(priorXp);
    const after = levelFromXp(priorXp + xp);
    if (after.level > before.level) {
      setLeveledTo(after.level);
      window.setTimeout(() => playLevelUp(), 400);
    }
    const stars = starsFromCorrect(c, a);
    if (stars >= 2) window.setTimeout(() => playStar(), 220);
    const habit = loadHabit(child.id);
    const best = Math.max(habit.bestCombo, combo);
    const priorDays = progress?.days ?? [];
    const today = todayKey();
    const days = priorDays.includes(today) ? priorDays : [...priorDays, today];
    const alreadyPlayed = (skills ?? []).some((s) => s.gameId === gid);
    const nextProgress: ChildProgress = {
      xp: priorXp + xp,
      plays: (progress?.plays ?? 0) + 1,
      perfects: (progress?.perfects ?? 0) + (a >= 8 && c === a ? 1 : 0),
      gamesPlayed: (progress?.gamesPlayed ?? 0) + (alreadyPlayed ? 0 : 1),
      days,
    };
    const beforeBadges = badgesFromProgress(progress, skills, { bestCombo: habit.bestCombo });
    const nextSkills = [
      ...(skills ?? []).filter((s) => s.gameId !== gid),
      {
        gameId: gid,
        level: lvl,
        mastery: Math.round((c / Math.max(1, a)) * 100),
        correct: c,
        attempts: a,
        streak: combo,
        bestStreak: best,
      },
    ];
    const afterBadges = badgesFromProgress(nextProgress, nextSkills, {
      bestCombo: best,
      threeStars: stars >= 3 || (progress?.perfects ?? 0) > 0,
    });
    const fresh = newBadges(beforeBadges, afterBadges);
    setUnlocked(fresh);
    if (fresh.length) window.setTimeout(() => playBadge(), 700);
    saveHabit(child.id, {
      bestCombo: best,
      seenBadges: [...new Set([...habit.seenBadges, ...afterBadges])],
    });
    const durationSec = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    try {
      if (!guest) {
        await recordSession({
          data: {
            childId: child.id,
            gameId: gid,
            correct: c,
            attempts: a,
            score: c * 10,
            xp,
            durationSec,
            level: lvl,
          },
        });
      }
    } catch {
      /* still show results */
    } finally {
      setSaving(false);
    }
    if (anotherOk() && !reducedMotion()) setCount(NEXT_SEC);
  };

  const nextQuestion = (lvl: number, nextIndex: number) => {
    sinceRetry.current += 1;
    if (!isMemory && retry.current.length > 0 && sinceRetry.current >= 2) {
      const queued = retry.current.shift()!;
      sinceRetry.current = 0;
      setWasRetry(true);
      setQ(reshuffle(queued));
      return;
    }
    setWasRetry(false);
    if (!isMemory) {
      const nextBeat = beatForIndex(nextIndex, ROUND);
      setQ(makeQuestion(gid, child.groupKey, beatLevel(lvl, nextBeat), nextBeat));
    }
  };

  const goOn = (ok: boolean, lvlNow: number, fromRetry: boolean) => {
    if (lock.current) return;
    lock.current = true;
    const a = attempts + 1;
    const c = correct + (ok ? 1 : 0);
    const ws = ok ? winStreak + 1 : 0;
    const ms = ok ? 0 : missStreak + 1;
    const nl = nextLevel(lvlNow, ws, ms);
    const combo = ok ? Math.max(bestCombo, ws) : bestCombo;
    const learned = ok && q.tag && !tags.includes(q.tag) ? [...tags, q.tag!] : tags;
    setAttempts(a);
    setCorrect(c);
    setWinStreak(ws);
    setMissStreak(ms);
    setLevel(nl);
    setBestCombo(combo);
    if (fromRetry && ok) setRepaired((n) => n + 1);
    if (index + 1 >= ROUND) {
      void finish(c, a, nl, learned, combo);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setPickedText(undefined);
    setPhase("ask");
    setJuice(null);
    lock.current = false;
    boardLock.current = false;
    nextQuestion(nl, index + 1);
  };

  const celebrateHit = (combo: number) => {
    const gain = xpForHit(combo);
    setGained((g) => g + gain);
    spawnXp(gain);
    tapHaptic(combo >= 5 ? 28 : 12);
    if (combo === 3 || combo === 5 || combo >= 8) playCombo(combo);
    else playCorrect(combo);
  };

  const reveal = (ok: boolean) => {
    setLastOk(ok);
    setPhase("feedback");
    setJuice(ok ? "pop" : "shake");
    if (ok && q.tag) setTags((t) => (t.includes(q.tag!) ? t : [...t, q.tag!]));
    if (!ok && !isMemory && !wasRetry) {
      retry.current.push(q);
    }
    if (ok) {
      const combo = winStreak + 1;
      setBestCombo((b) => Math.max(b, combo));
      celebrateHit(combo);
    }
  };

  const onChoice = (i: number) => {
    if (picked != null || done || phase !== "ask") return;
    unlockAudio();
    playTap();
    const ok = q.kind === "choice" && i === q.answer;
    setPicked(i);
    if (!ok) playWrong();
    reveal(ok);
  };

  const onBoardSolve = (ok: boolean, label?: string) => {
    if (phase !== "ask" || done || boardLock.current) return;
    boardLock.current = true;
    unlockAudio();
    setPickedText(label);
    if (!ok) playWrong();
    reveal(ok);
  };

  const onContinue = () => {
    if (phase !== "feedback" || done) return;
    goOn(lastOk, level, wasRetry);
  };

  useEffect(() => {
    if (phase !== "feedback" || done || !lastOk) return;
    if (wasRetry || beat === "boss") return;
    const ms = beat === "warmup" ? 2800 : 2200;
    const t = window.setTimeout(() => {
      goOn(true, level, wasRetry);
    }, ms);
    return () => window.clearTimeout(t);
    // Feedback auto-advance is a one-shot for this item.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, lastOk, done, index, wasRetry, beat]);

  useEffect(() => {
    if (done || phase === "brief") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (phase === "feedback" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onContinue();
        return;
      }
      const n = Number(e.key);
      if (phase === "ask" && q.kind === "choice" && !isMemory && n >= 1 && n <= q.choices.length) {
        e.preventDefault();
        onChoice(n - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const boot = useRef(false);
  useEffect(() => {
    if (!done || count == null) return;
    if (count <= 0) {
      if (boot.current) return;
      boot.current = true;
      resetRound(false);
      boot.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      playTick();
      setCount((c) => (c == null ? null : c - 1));
    }, 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, count]);

  const onMemPad = (i: number) => {
    if (memPhase !== "play" || done || phase !== "ask") return;
    unlockAudio();
    playTap();
    const expect = seq[progressMem];
    if (i === expect) {
      const next = progressMem + 1;
      setProgressMem(next);
      if (next >= seq.length) {
        reveal(true);
      }
    } else {
      playWrong();
      setLit([expect ?? i]);
      reveal(false);
    }
  };

  const pct = Math.round((index / ROUND) * 100);
  const nextMeta = nextGameId ? gameById(nextGameId) : undefined;
  const combo = comboLine(winStreak);
  const brief = briefing(gid, startLevel, child.name, priorTags, child.groupKey);
  const world = loadWorld(child.id, child.avatar);
  const pickedLabel = pickedText ?? (q.kind === "choice" && picked != null ? q.choices[picked] : undefined);
  const correctLabel = answerLabel(q);
  const showHint = hintOpen && !!q.hint && phase === "ask" && (!isMemory || memPhase === "play");
  const board = !isMemory && isPlayBoard(q);
  const track = starTrackLine(correct, attempts, ROUND - index - (phase === "feedback" ? 0 : 1));

  if (!meta) {
    return <p className="p-8">Onbekend spel.</p>;
  }

  if (phase === "brief" && !done) {
    return (
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col items-center justify-center overflow-hidden px-4 py-10 text-center sm:max-w-xl">
        <img
          src={gameArt(gid)}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
        <div className="relative">
          <img src={gameArt(gid)} alt="" className="mx-auto h-36 w-56 rounded-3xl object-cover shadow-[var(--shadow-lift)] lumi-ring" />
          <Kicker className="mt-6">{brief.kicker}</Kicker>
          <h1 className="mt-3 font-display text-4xl font-medium">{brief.title}</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{brief.body}</p>
          <div className="mt-4 max-w-sm rounded-2xl bg-surface px-4 py-3 text-left shadow-[var(--shadow-card)]">
            <p className="text-xs font-medium uppercase tracking-wider text-faint">De regel</p>
            <p className="mt-1 text-sm text-ink">{brief.theory}</p>
            <p className="mt-2 text-sm text-muted">{brief.tip}</p>
          </div>
          <Button
            className="mt-8"
            size="lg"
            onClick={() => {
              unlockAudio();
              playTap();
              started.current = Date.now();
              setPhase("ask");
            }}
          >
            Start
          </Button>
          <Link to={guest ? "/" : "/spelen"} className="mt-4 block text-sm text-muted hover:text-ink">
            Terug
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    const stars = starsFromCorrect(correct, attempts);
    const miss = nearMissLine(correct, attempts);
    const priorXp = progress?.xp ?? 0;
    const info = levelFromXp(priorXp + gained);
    const streakDays = streakFromDays([...(progress?.days ?? []), todayKey()]);
    const todayAlready = (progress?.days ?? []).includes(todayKey());
    const hook = continueHook(stars, leveledTo != null, Math.max(1, streakDays), todayAlready);
    const canMore = anotherOk();
    return (
      <div className="relative mx-auto flex min-h-[70dvh] w-full max-w-lg flex-col items-center justify-center px-4 py-10 text-center sm:max-w-xl">
        <Confetti on={stars >= 2 || leveledTo != null} />
        <Kicker>{leveledTo ? levelTitle(leveledTo, world) : "Klaar"}</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium">
          {leveledTo ? `${child.name}, je groeit` : `Goed bezig, ${child.name}`}
        </h1>
        <p className="mt-3 text-muted">
          {correct} van {attempts} goed · +{gained} XP
        </p>
        <div className="mt-6">
          <RoundStars n={stars} world={world} />
        </div>
        <div className="mt-6 w-full max-w-sm text-left">
          <XpBar info={info} world={world} />
        </div>
        {unlocked.length > 0 ? (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Nieuw</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {unlocked.map((id) => (
                <span key={id} className="lumi-burst inline-flex flex-col items-center gap-1">
                  <BadgeMark id={id} world={world} />
                  <span className="text-xs">{badgeTitle(id, world)}</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
          {recapLine(tags, correct, attempts, repaired)}
        </p>
        {miss ? <p className="mt-2 max-w-sm text-sm font-medium text-clay">{miss}</p> : null}
        <p className="mt-4 max-w-sm rounded-2xl bg-surface px-4 py-3 text-sm text-ink shadow-[var(--shadow-card)]">
          {hook} {tomorrowHook(gid, level)}
        </p>
        <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
          {canMore ? (
            <Button
              size="lg"
              onClick={() => {
                unlockAudio();
                playTap();
                resetRound(false);
              }}
            >
              Nog een ronde{count != null ? ` · ${count}` : ""}
            </Button>
          ) : null}
          {nextMeta && !guest ? (
            <Button variant={canMore ? "secondary" : "default"} asChild>
              <Link to="/spelen/$gameId" params={{ gameId: nextMeta.id }} search={{ kind: child.id }}>
                Volgende: {nextMeta.title}
              </Link>
            </Button>
          ) : (
            <Button variant={canMore ? "secondary" : "default"} asChild>
              <Link to={guest ? "/" : "/spelen"}>{guest ? "Alle spellen" : "Naar de spellen"}</Link>
            </Button>
          )}
          <div className="flex items-center justify-center gap-4">
            {count != null ? (
              <button
                type="button"
                className="text-sm text-muted underline decoration-border-strong underline-offset-4 hover:text-ink"
                onClick={() => setCount(null)}
              >
                Niet automatisch
              </button>
            ) : null}
            {guest ? null : (
            <ParentLink
              to="/ouders"
              hasPin={hasPin}
              className="inline-flex h-11 items-center justify-center text-sm text-muted hover:text-ink"
            >
              Naar ouderzone
            </ParentLink>
            )}
          </div>
        </div>
        {saving ? <p className="mt-4 text-xs text-faint">Voortgang opslaan…</p> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:max-w-xl md:max-w-2xl",
        juice === "pop" && "lumi-pop",
        juice === "shake" && "lumi-shake",
      )}
    >
      <img
        src={gameArt(gid)}
        alt=""
        className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full object-cover opacity-25"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      <XpPops items={pops} />
      <div className="relative mb-3 flex items-center gap-2">
        <Link to={guest ? "/" : "/spelen"} className="inline-flex h-11 shrink-0 items-center text-sm text-muted hover:text-ink">
          Terug
        </Link>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-ink">{meta.title}</p>
        <div className="flex shrink-0 items-center">
          <p className="hidden tabular-nums text-xs text-muted sm:block">+{gained} XP</p>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-ink"
            aria-label={mute ? "Geluid aan" : "Geluid uit"}
            onClick={() => {
              const next = !mute;
              setMute(next);
              setMuted(next);
            }}
          >
            {mute ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <p className="w-9 text-right tabular-nums text-sm text-muted">
            {index + 1}/{ROUND}
          </p>
        </div>
      </div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: ROUND }, (_, i) => (
          <span
            key={i}
            className={cn(
              "lumi-pip h-1.5 flex-1 rounded-full",
              i < index && "lumi-pip-on bg-primary",
              i === index && (beatForIndex(i, ROUND) === "boss" ? "bg-clay" : "bg-primary/45"),
              i > index && (beatForIndex(i, ROUND) === "boss" ? "bg-clay/30" : "bg-surface-2"),
            )}
          />
        ))}
      </div>
      {winStreak >= 2 ? (
        <div className="mt-3">
          <ComboHud n={winStreak} />
        </div>
      ) : (
        <p className="mt-3 text-center text-xs text-faint">{combo ?? beatLine(beat, index, ROUND)}</p>
      )}
      {track ? <p className="mt-1 text-center text-xs font-medium text-clay">{track}</p> : null}
      <div className="mt-6 flex-1">
        {isMemory ? (
          <>
            <h2 className="text-center font-display text-2xl font-medium">
              {phase === "feedback"
                ? lastOk
                  ? "Onthouden"
                  : "Kijk nog eens"
                : memPhase === "watch"
                  ? "Kijk goed"
                  : "Speel de volgorde na"}
            </h2>
            <p className="mt-2 text-center text-sm text-muted">{memLen} stappen. Zeg ze in je hoofd.</p>
            <div className="mt-8">
              <MemoryBoard
                size={memSize}
                active={active}
                lit={lit}
                disabled={memPhase !== "play" || phase !== "ask"}
                onPad={onMemPad}
              />
            </div>
          </>
        ) : null}
        {!isMemory ? (
          <>
            {q.setup ? <p className="text-center text-sm text-muted">{q.setup}</p> : null}
            <h2 className={cn("text-center font-display text-[1.65rem] font-medium leading-tight sm:text-3xl", q.setup && "mt-2")}>
              {q.prompt}
            </h2>
            {wasRetry && phase === "ask" ? (
              <p className="mt-2 text-center text-sm text-clay">Deze had je net. Gebruik de truc. Nu zit hij.</p>
            ) : null}
            {board ? (
              <PlayBoard q={q} locked={phase !== "ask"} onSolve={onBoardSolve} />
            ) : (
              <>
                <GameVisual visual={q.visual} reveal={phase === "feedback"} scaffold={showHint} />
                {q.kind === "choice" ? (
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lumi-tiles">
                    {q.choices.map((c, i) => {
                      const show = picked != null;
                      const isAns = i === q.answer;
                      const isPick = i === picked;
                      return (
                        <button
                          key={`${c}-${i}`}
                          type="button"
                          onClick={() => onChoice(i)}
                          className={cn(
                            "lumi-block min-h-14 rounded-2xl px-4 py-3 text-left text-lg font-medium transition-[transform,background-color] duration-150",
                            !show && "bg-surface text-ink hover:bg-surface-2",
                            show && isAns && "bg-ok text-primary-fg",
                            show && isPick && !isAns && "bg-danger text-primary-fg",
                            show && !isAns && !isPick && "bg-surface text-muted",
                          )}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}

        {phase === "ask" && !showHint && hintReady && q.hint ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              className="text-sm text-muted underline decoration-border-strong underline-offset-4 hover:text-ink"
              onClick={() => {
                unlockAudio();
                playTap();
                setHintOpen(true);
              }}
            >
              Tip
            </button>
          </div>
        ) : null}
        {showHint ? (
          <p className="mt-5 text-center text-sm leading-relaxed text-muted">{q.hint}</p>
        ) : null}

        {phase === "feedback" ? (
          <div className="mt-6 rounded-2xl bg-surface px-4 py-4 shadow-[var(--shadow-card)]">
            <p className={cn("text-sm leading-relaxed", lastOk ? "text-ok" : "text-ink")}>
              {isMemory
                ? lastOk
                  ? "Ja. Je zei de volgorde in je hoofd. Daarom lukte het."
                  : "Het juiste vak lichtte even op. Kijk, zeg, tik. Gokken onthoud je niet."
                : feedbackLine({
                    ok: lastOk,
                    teach: q.teach,
                    picked: pickedLabel,
                    correct: correctLabel,
                    wasRetry,
                    lostStreak: lastOk ? 0 : winStreak,
                  })}
            </p>
            <Button className="mt-4 w-full" onClick={onContinue}>
              {continueLine(index, ROUND, lastOk)}
            </Button>
          </div>
        ) : null}
      </div>
      <p className="sr-only">{pct} procent</p>
    </div>
  );
}
