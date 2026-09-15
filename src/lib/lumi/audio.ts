let ctx: AudioContext | null = null;
const MUTE_KEY = "lumi.mute";

function muted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function isMuted(): boolean {
  return muted();
}

export function setMuted(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MUTE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockAudio() {
  ac();
}

function tone(freq: number, t: number, dur: number, type: OscillatorType, gain = 0.08) {
  if (muted()) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime + t);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + t);
  o.stop(c.currentTime + t + dur + 0.02);
}

export function playCorrect(streak = 1) {
  const bump = Math.min(5, Math.max(0, streak - 1)) * 40;
  tone(523.25 + bump, 0, 0.1, "sine", 0.07);
  tone(659.25 + bump, 0.07, 0.11, "sine", 0.07);
  tone(783.99 + bump, 0.14, 0.16, "triangle", 0.06);
}

export function playWrong() {
  tone(196, 0, 0.18, "triangle", 0.05);
}

export function playTap() {
  tone(440, 0, 0.06, "sine", 0.04);
}

export function playWin() {
  tone(523.25, 0, 0.12, "sine");
  tone(659.25, 0.1, 0.12, "sine");
  tone(783.99, 0.2, 0.12, "sine");
  tone(1046.5, 0.32, 0.28, "triangle", 0.07);
}

export function playCombo(n: number) {
  const steps = Math.min(5, Math.max(2, n));
  for (let i = 0; i < steps; i++) {
    tone(523.25 + i * 80, i * 0.05, 0.09, i === steps - 1 ? "triangle" : "sine", 0.05 + i * 0.008);
  }
}

export function playLevelUp() {
  tone(392, 0, 0.1, "sine", 0.06);
  tone(523.25, 0.1, 0.1, "sine", 0.06);
  tone(659.25, 0.2, 0.12, "sine", 0.07);
  tone(783.99, 0.32, 0.14, "triangle", 0.07);
  tone(1046.5, 0.48, 0.28, "triangle", 0.08);
}

export function playStar() {
  tone(880, 0, 0.08, "sine", 0.05);
  tone(1320, 0.08, 0.14, "triangle", 0.05);
}

export function playBadge() {
  tone(698.46, 0, 0.1, "triangle", 0.06);
  tone(880, 0.12, 0.18, "sine", 0.06);
}

export function playTick() {
  tone(660, 0, 0.04, "square", 0.03);
}

export function tapHaptic(ms = 12) {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}

