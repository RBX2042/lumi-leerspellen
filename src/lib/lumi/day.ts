/** Calendar day in the Netherlands — daily limits and streaks follow this, not UTC. */
export const LUMI_TZ = "Europe/Amsterdam";

export function dayKey(d = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: LUMI_TZ });
}

/** Shift a YYYY-MM-DD key without timezone surprises. */
export function shiftDay(key: string, delta: number): string {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
