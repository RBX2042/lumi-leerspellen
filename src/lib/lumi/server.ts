import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { FREE_GAMES, gameById } from "./catalog";
import { dayKey } from "./day.ts";
import { entitlementOf, TRIAL_DAYS } from "./pricing";
import { PRICE, TARGET_MRR } from "./brand";
import type {
  AvatarId,
  Child,
  ChildProgress,
  DailyUse,
  FamilySnapshot,
  GameId,
  GroupKey,
  PlaySession,
  PlanId,
  Skill,
  Subscription,
} from "./types";
import { AVATARS, GAME_ID_LIST, GROUPS } from "./types";

type ChildRow = {
  id: number;
  user_id: string;
  name: string;
  age: number;
  group_key: string;
  avatar: string;
  daily_minutes: number;
  created_at: string;
};
type SubRow = {
  user_id: string;
  plan: string;
  status: string;
  trial_ends_at: string | null;
  period_end: string | null;
  billing: string | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  trial_used: boolean | null;
};
type SkillRow = {
  child_id: number;
  game_id: string;
  level: number;
  mastery: number;
  correct: number;
  attempts: number;
  streak: number;
  best_streak: number;
};
type SessionRow = {
  id: number;
  child_id: number;
  game_id: string;
  score: number;
  correct: number;
  attempts: number;
  xp: number;
  duration_sec: number;
  created_at: string;
};
type DailyRow = {
  child_id: number;
  day: string;
  plays: number;
  minutes: number;
};

function referralCodeFor(userId: string): string {
  return createHash("sha256").update(`lumi:${userId}`).digest("hex").slice(0, 6).toUpperCase();
}

function pinHash(userId: string, pin: string): string {
  return createHash("sha256").update(`lumi-pin:${userId}:${pin}`).digest("hex");
}

function mapChild(r: ChildRow): Child {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    age: r.age,
    groupKey: r.group_key as GroupKey,
    avatar: r.avatar as AvatarId,
    dailyMinutes: r.daily_minutes,
    createdAt: r.created_at,
  };
}
function mapSub(r: SubRow): Subscription {
  return {
    userId: r.user_id,
    plan: r.plan as PlanId,
    status: r.status,
    trialEndsAt: r.trial_ends_at,
    periodEnd: r.period_end,
    billing: r.billing === "year" ? "year" : "month",
    referralCode: r.referral_code || referralCodeFor(r.user_id),
    referredBy: r.referred_by,
    createdAt: r.created_at,
    trialUsed: !!r.trial_used,
  };
}

async function ensureSub(userId: string): Promise<Subscription> {
  const sql = await getSql();
  const existing = await sql<SubRow>`select user_id, plan, status, trial_ends_at, period_end, billing, referral_code, referred_by, created_at, trial_used from lumi_subscriptions where user_id = ${userId}`;
  const code = referralCodeFor(userId);
  if (existing[0]) {
    if (!existing[0].referral_code) {
      await sql`update lumi_subscriptions set referral_code = ${code} where user_id = ${userId} and referral_code is null`;
      existing[0].referral_code = code;
    }
    const expired =
      existing[0].plan === "trial" &&
      !!existing[0].trial_ends_at &&
      new Date(existing[0].trial_ends_at).getTime() <= Date.now();
    if (expired) {
      await sql`update lumi_subscriptions set plan = 'free', status = 'expired' where user_id = ${userId} and plan = 'trial'`;
      existing[0].plan = "free";
      existing[0].status = "expired";
    }
    return mapSub(existing[0]);
  }
  await sql`insert into lumi_subscriptions (user_id, plan, status, billing, referral_code) values (${userId}, 'free', 'active', 'month', ${code})`;
  const created = await sql<SubRow>`select user_id, plan, status, trial_ends_at, period_end, billing, referral_code, referred_by, created_at, trial_used from lumi_subscriptions where user_id = ${userId}`;
  return mapSub(created[0]!);
}

function todayIso(): string {
  return dayKey();
}

export const getFamily = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<FamilySnapshot> => {
    const sql = await getSql();
    const userId = context.userId;
    const sub = await ensureSub(userId);
    const children = (
      await sql<ChildRow>`select id, user_id, name, age, group_key, avatar, daily_minutes, created_at from lumi_children where user_id = ${userId} order by created_at`
    ).map(mapChild);
    const skillsRows = await sql<SkillRow>`select child_id, game_id, level, mastery, correct, attempts, streak, best_streak from lumi_skill where user_id = ${userId}`;
    const skills: Record<number, Skill[]> = {};
    for (const r of skillsRows) {
      (skills[r.child_id] ??= []).push({
        gameId: r.game_id as GameId,
        level: r.level,
        mastery: r.mastery,
        correct: r.correct,
        attempts: r.attempts,
        streak: r.streak,
        bestStreak: r.best_streak,
      });
    }
    const recent = (
      await sql<SessionRow>`select id, child_id, game_id, score, correct, attempts, xp, duration_sec, created_at from lumi_sessions where user_id = ${userId} order by created_at desc limit 40`
    ).map(
      (r): PlaySession => ({
        id: r.id,
        childId: r.child_id,
        gameId: r.game_id as GameId,
        score: r.score,
        correct: r.correct,
        attempts: r.attempts,
        xp: r.xp,
        durationSec: r.duration_sec,
        createdAt: r.created_at,
      }),
    );
    const day = todayIso();
    const dailyRows = await sql<DailyRow>`select child_id, day, plays, minutes from lumi_daily where user_id = ${userId} and day = ${day}`;
    const today: Record<number, DailyUse> = {};
    for (const r of dailyRows) {
      today[r.child_id] = { day: r.day, plays: r.plays, minutes: r.minutes };
    }
    const weekRows = await sql<{ child_id: number; minutes: number }>`
      select child_id, coalesce(sum(minutes), 0)::int as minutes
      from lumi_daily
      where user_id = ${userId} and day >= (current_date - interval '6 days')
      group by child_id
    `;
    const weekMinutes: Record<number, number> = {};
    for (const r of weekRows) weekMinutes[r.child_id] = r.minutes;
    const xpRows = await sql<{ child_id: number; xp: number; plays: number; games: number }>`
      select child_id,
        coalesce(sum(xp), 0)::int as xp,
        count(*)::int as plays,
        count(distinct game_id)::int as games
      from lumi_sessions
      where user_id = ${userId}
      group by child_id
    `;
    const perfectRows = await sql<{ child_id: number; c: number }>`
      select child_id, count(*)::int as c
      from lumi_sessions
      where user_id = ${userId} and attempts >= 8 and correct = attempts
      group by child_id
    `;
    const dayRows = await sql<{ child_id: number; day: string }>`
      select child_id, (timezone('Europe/Amsterdam', created_at))::date::text as day
      from lumi_sessions
      where user_id = ${userId} and created_at >= (timezone('Europe/Amsterdam', now()) - interval '40 days')
      group by child_id, (timezone('Europe/Amsterdam', created_at))::date
    `;
    const progress: Record<number, ChildProgress> = {};
    for (const r of xpRows) {
      progress[r.child_id] = {
        xp: r.xp,
        plays: r.plays,
        perfects: 0,
        gamesPlayed: r.games,
        days: [],
      };
    }
    for (const r of perfectRows) {
      (progress[r.child_id] ??= { xp: 0, plays: 0, perfects: 0, gamesPlayed: 0, days: [] }).perfects = r.c;
    }
    for (const r of dayRows) {
      const row = (progress[r.child_id] ??= { xp: 0, plays: 0, perfects: 0, gamesPlayed: 0, days: [] });
      const raw = r.day as unknown;
      const day =
        raw instanceof Date
          ? `${raw.getFullYear()}-${String(raw.getMonth() + 1).padStart(2, "0")}-${String(raw.getDate()).padStart(2, "0")}`
          : String(raw).slice(0, 10);
      if (day && !row.days.includes(day)) row.days.push(day);
    }
    const refRows = await sql<{ c: number }>`select count(*)::int as c from lumi_subscriptions where referred_by = ${userId}`;
    const pinRow = await sql<{ pin_hash: string | null }>`select pin_hash from lumi_subscriptions where user_id = ${userId}`;
    return {
      children,
      subscription: sub,
      entitlement: entitlementOf(sub),
      skills,
      recent,
      today,
      weekMinutes,
      progress,
      referralCode: sub.referralCode,
      referralCount: refRows[0]?.c ?? 0,
      hasPin: !!pinRow[0]?.pin_hash,
    };
  });

export const addChild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().min(1).max(24),
      age: z.number().int().min(4).max(12),
      groupKey: z.enum(["groep1", "groep2", "groep3", "groep4", "groep5", "groep6", "groep7", "groep8"]),
      avatar: z.enum(["uil", "vos", "beer", "haas", "hert", "egel", "ster", "leeuw"]),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const sub = await ensureSub(context.userId);
    const ent = entitlementOf(sub);
    const existing = await sql<{ c: number }>`select count(*)::int as c from lumi_children where user_id = ${context.userId}`;
    if ((existing[0]?.c ?? 0) >= ent.maxChildren) {
      throw new Error("Kindlimiet bereikt voor dit abonnement");
    }
    if (!GROUPS.some((g) => g.key === data.groupKey)) throw new Error("Onbekende groep");
    const rows = await sql<ChildRow>`
      insert into lumi_children (user_id, name, age, group_key, avatar)
      values (${context.userId}, ${data.name.trim()}, ${data.age}, ${data.groupKey}, ${data.avatar})
      returning id, user_id, name, age, group_key, avatar, daily_minutes, created_at
    `;
    return mapChild(rows[0]!);
  });

export const addChildrenBulk = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      names: z.array(z.string().min(1).max(24)).min(1).max(30),
      age: z.number().int().min(4).max(12),
      groupKey: z.enum(["groep1", "groep2", "groep3", "groep4", "groep5", "groep6", "groep7", "groep8"]),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const sub = await ensureSub(context.userId);
    const ent = entitlementOf(sub);
    const existing = await sql<{ c: number }>`select count(*)::int as c from lumi_children where user_id = ${context.userId}`;
    const used = existing[0]?.c ?? 0;
    const room = ent.maxChildren - used;
    if (room <= 0) throw new Error("Kindlimiet bereikt voor dit abonnement");
    const names = data.names.map((n) => n.trim()).filter(Boolean).slice(0, room);
    const made: Child[] = [];
    for (let i = 0; i < names.length; i++) {
      const avatar = AVATARS[i % AVATARS.length]!.id;
      const rows = await sql<ChildRow>`
        insert into lumi_children (user_id, name, age, group_key, avatar)
        values (${context.userId}, ${names[i]!}, ${data.age}, ${data.groupKey}, ${avatar})
        returning id, user_id, name, age, group_key, avatar, daily_minutes, created_at
      `;
      made.push(mapChild(rows[0]!));
    }
    return { added: made.length, skipped: data.names.length - made.length };
  });

export const updateChild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number().int(),
      dailyMinutes: z.number().int().min(5).max(60).optional(),
      groupKey: z.enum(["groep1", "groep2", "groep3", "groep4", "groep5", "groep6", "groep7", "groep8"]).optional(),
      name: z.string().min(1).max(24).optional(),
      avatar: z.enum(["uil", "vos", "beer", "haas", "hert", "egel", "ster", "leeuw"]).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.dailyMinutes != null) {
      await sql`update lumi_children set daily_minutes = ${data.dailyMinutes} where id = ${data.id} and user_id = ${context.userId}`;
    }
    if (data.groupKey) {
      await sql`update lumi_children set group_key = ${data.groupKey} where id = ${data.id} and user_id = ${context.userId}`;
    }
    if (data.name) {
      await sql`update lumi_children set name = ${data.name.trim()} where id = ${data.id} and user_id = ${context.userId}`;
    }
    if (data.avatar) {
      await sql`update lumi_children set avatar = ${data.avatar} where id = ${data.id} and user_id = ${context.userId}`;
    }
    return { ok: true };
  });

export const removeChild = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from lumi_skill where child_id = ${data.id} and user_id = ${context.userId}`;
    await sql`delete from lumi_sessions where child_id = ${data.id} and user_id = ${context.userId}`;
    await sql`delete from lumi_daily where child_id = ${data.id} and user_id = ${context.userId}`;
    await sql`delete from lumi_children where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const startTrial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const sub = await ensureSub(context.userId);
    if (sub.plan === "gezin" || sub.plan === "plus" || sub.plan === "school") return sub;
    const trialActive =
      sub.plan === "trial" && !!sub.trialEndsAt && new Date(sub.trialEndsAt).getTime() > Date.now();
    if (trialActive) return sub;
    if (sub.trialUsed) throw new Error(`De proef van ${TRIAL_DAYS} dagen is al gebruikt`);
    const ends = new Date(Date.now() + TRIAL_DAYS * 86_400_000).toISOString();
    await sql`update lumi_subscriptions set plan = 'trial', status = 'active', trial_ends_at = ${ends}, trial_used = true where user_id = ${context.userId}`;
    return ensureSub(context.userId);
  });

export const activatePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ plan: z.enum(["gezin", "plus", "school"]), yearly: z.boolean() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSub(context.userId);
    const days = data.yearly ? 365 : 30;
    const end = new Date(Date.now() + days * 86_400_000).toISOString();
    const billing = data.yearly ? "year" : "month";
    await sql`update lumi_subscriptions set plan = ${data.plan}, status = 'active', period_end = ${end}, billing = ${billing}, trial_used = true where user_id = ${context.userId}`;
    return ensureSub(context.userId);
  });

export const cancelPlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update lumi_subscriptions set plan = 'free', status = 'cancelled', trial_ends_at = null, period_end = null, billing = 'month' where user_id = ${context.userId}`;
    return ensureSub(context.userId);
  });

export const setPin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ pin: z.string().regex(/^\d{4}$/) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSub(context.userId);
    const hash = pinHash(context.userId, data.pin);
    await sql`update lumi_subscriptions set pin_hash = ${hash} where user_id = ${context.userId}`;
    return { ok: true as const };
  });

export const checkPin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ pin: z.string().regex(/^\d{4}$/) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ pin_hash: string | null }>`select pin_hash from lumi_subscriptions where user_id = ${context.userId}`;
    const stored = rows[0]?.pin_hash;
    if (!stored) return { ok: true as const };
    return { ok: stored === pinHash(context.userId, data.pin) };
  });

export const submitHelpMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ note: z.string().min(8).max(800) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSub(context.userId);
    await sql`insert into lumi_leads (user_id, kind, school, note) values (${context.userId}, 'hulp', 'website', ${data.note.trim()})`;
    return { ok: true as const };
  });

export const applyReferral = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ code: z.string().min(4).max(16) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const sub = await ensureSub(context.userId);
    const code = data.code.trim().toUpperCase();
    if (sub.referralCode === code) return { ok: true as const, applied: false };
    if (sub.referredBy) return { ok: true as const, applied: false };
    const host = await sql<SubRow>`select user_id, plan, status, trial_ends_at, period_end, billing, referral_code, referred_by, created_at, trial_used from lumi_subscriptions where referral_code = ${code}`;
    if (!host[0] || host[0].user_id === context.userId) return { ok: false as const, applied: false };
    await sql`update lumi_subscriptions set referred_by = ${host[0].user_id} where user_id = ${context.userId}`;
    return { ok: true as const, applied: true };
  });

export const submitSchoolLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      school: z.string().min(2).max(80),
      groep: z.string().max(24).optional(),
      note: z.string().max(400).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureSub(context.userId);
    await sql`insert into lumi_leads (user_id, kind, school, groep, note) values (${context.userId}, 'school', ${data.school.trim()}, ${data.groep?.trim() || null}, ${data.note?.trim() || null})`;
    return { ok: true as const };
  });

export const deleteAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ confirm: z.literal("VERWIJDER") }))
  .handler(async ({ context }) => {
    const sql = await getSql();
    const userId = context.userId;
    await sql`delete from lumi_skill where user_id = ${userId}`;
    await sql`delete from lumi_sessions where user_id = ${userId}`;
    await sql`delete from lumi_daily where user_id = ${userId}`;
    await sql`delete from lumi_children where user_id = ${userId}`;
    await sql`delete from lumi_leads where user_id = ${userId}`;
    await sql`delete from lumi_subscriptions where user_id = ${userId}`;
    await sql`delete from "session" where "userId" = ${userId}`;
    await sql`delete from "account" where "userId" = ${userId}`;
    await sql`delete from "user" where "id" = ${userId}`;
    return { ok: true as const };
  });

const resultSchema = z.object({
  childId: z.number().int(),
  gameId: z.enum(GAME_ID_LIST),
  correct: z.number().int().min(0),
  attempts: z.number().int().min(0),
  score: z.number().int().min(0),
  xp: z.number().int().min(0),
  durationSec: z.number().int().min(0),
  level: z.number().int().min(1).max(12),
});

export const recordSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(resultSchema)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const kids = await sql<ChildRow>`select id, user_id, name, age, group_key, avatar, daily_minutes, created_at from lumi_children where id = ${data.childId} and user_id = ${context.userId}`;
    const child = kids[0];
    if (!child) throw new Error("Kind niet gevonden");
    const sub = await ensureSub(context.userId);
    const ent = entitlementOf(sub);
    const game = gameById(data.gameId);
    if (!game) throw new Error("Onbekend spel");
    if (!ent.games.includes(data.gameId as GameId) && !FREE_GAMES.includes(data.gameId as GameId)) {
      throw new Error("Dit spel zit in Gezin");
    }
    const day = todayIso();
    const daily = await sql<DailyRow>`select child_id, day, plays, minutes from lumi_daily where child_id = ${data.childId} and day = ${day}`;
    const plays = daily[0]?.plays ?? 0;
    if (ent.dailyPlays != null && plays >= ent.dailyPlays) {
      throw new Error("Daglimiet bereikt");
    }
    const usedMin = daily[0]?.minutes ?? 0;
    if (usedMin >= child.daily_minutes) {
      throw new Error("Speeltijd voor vandaag is op");
    }
    const minutes = Math.max(1, Math.round(data.durationSec / 60));
    if (daily[0]) {
      await sql`update lumi_daily set plays = plays + 1, minutes = minutes + ${minutes} where child_id = ${data.childId} and day = ${day}`;
    } else {
      await sql`insert into lumi_daily (user_id, child_id, day, plays, minutes) values (${context.userId}, ${data.childId}, ${day}, 1, ${minutes})`;
    }
    await sql`insert into lumi_sessions (user_id, child_id, game_id, score, correct, attempts, xp, duration_sec)
      values (${context.userId}, ${data.childId}, ${data.gameId}, ${data.score}, ${data.correct}, ${data.attempts}, ${data.xp}, ${data.durationSec})`;

    const skill = await sql<SkillRow>`select child_id, game_id, level, mastery, correct, attempts, streak, best_streak from lumi_skill where child_id = ${data.childId} and game_id = ${data.gameId}`;
    const addCorrect = data.correct;
    const addAttempts = data.attempts;
    const ratio = addAttempts ? addCorrect / addAttempts : 0;
    const newMastery = Math.max(0, Math.min(100, Math.round((skill[0]?.mastery ?? 0) * 0.7 + ratio * 100 * 0.3)));
    const streak = ratio >= 0.7 ? (skill[0]?.streak ?? 0) + 1 : 0;
    const best = Math.max(skill[0]?.best_streak ?? 0, streak);
    if (skill[0]) {
      await sql`update lumi_skill set
        level = ${data.level},
        mastery = ${newMastery},
        correct = correct + ${addCorrect},
        attempts = attempts + ${addAttempts},
        streak = ${streak},
        best_streak = ${best},
        updated_at = now()
        where child_id = ${data.childId} and game_id = ${data.gameId} and user_id = ${context.userId}`;
    } else {
      await sql`insert into lumi_skill (user_id, child_id, game_id, level, mastery, correct, attempts, streak, best_streak)
        values (${context.userId}, ${data.childId}, ${data.gameId}, ${data.level}, ${newMastery}, ${addCorrect}, ${addAttempts}, ${streak}, ${best})`;
    }
    return { ok: true as const };
  });

export const getChildSkill = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ childId: z.number().int(), gameId: z.string() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<SkillRow>`select child_id, game_id, level, mastery, correct, attempts, streak, best_streak from lumi_skill where child_id = ${data.childId} and game_id = ${data.gameId} and user_id = ${context.userId}`;
    const child = await sql<ChildRow>`select id, user_id, name, age, group_key, avatar, daily_minutes, created_at from lumi_children where id = ${data.childId} and user_id = ${context.userId}`;
    if (!child[0]) throw new Error("Kind niet gevonden");
    return {
      child: mapChild(child[0]),
      level: rows[0]?.level ?? 1,
      mastery: rows[0]?.mastery ?? 0,
      entitlement: entitlementOf(await ensureSub(context.userId)),
    };
  });

export type GrowthStats = {
  gezin: number;
  plus: number;
  school: number;
  trial: number;
  free: number;
  leads: number;
  referrals: number;
  mrr: number;
  target: number;
};

export const getGrowthStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<GrowthStats> => {
    const sql = await getSql();
    const rows = await sql<{ plan: string; billing: string; c: number }>`
      select plan, coalesce(billing, 'month') as billing, count(*)::int as c
      from lumi_subscriptions
      group by plan, coalesce(billing, 'month')
    `;
    const count = (id: string) =>
      rows.filter((r) => r.plan === id).reduce((a, r) => a + r.c, 0);
    const monthlyOf = (id: string, monthPrice: number, yearPrice: number) => {
      let sum = 0;
      for (const r of rows) {
        if (r.plan !== id) continue;
        sum += r.billing === "year" ? r.c * (yearPrice / 12) : r.c * monthPrice;
      }
      return sum;
    };
    const gezin = count("gezin");
    const plus = count("plus");
    const school = count("school");
    const mrr =
      monthlyOf("gezin", PRICE.gezin, PRICE.gezinYear) +
      monthlyOf("plus", PRICE.plus, PRICE.plusYear) +
      monthlyOf("school", PRICE.school, PRICE.schoolYear);
    const leadRows = await sql<{ c: number }>`select count(*)::int as c from lumi_leads`;
    const refRows = await sql<{ c: number }>`select count(*)::int as c from lumi_subscriptions where referred_by is not null`;
    return {
      gezin,
      plus,
      school,
      trial: count("trial"),
      free: count("free"),
      leads: leadRows[0]?.c ?? 0,
      referrals: refRows[0]?.c ?? 0,
      mrr: Math.round(mrr * 100) / 100,
      target: TARGET_MRR,
    };
  },
);
