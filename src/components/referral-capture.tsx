import { useEffect } from "react";

const KEY = "lumi.ref";

export function storeReferral(code: string) {
  if (typeof window === "undefined") return;
  const clean = code.trim().toUpperCase();
  if (clean.length >= 4 && clean.length <= 16) {
    window.sessionStorage.setItem(KEY, clean);
  }
}

export function peekReferral(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(KEY);
}

export function takeReferral(): string | null {
  const v = peekReferral();
  if (v) window.sessionStorage.removeItem(KEY);
  return v;
}

export function ReferralCapture() {
  useEffect(() => {
    try {
      const ref = new URL(window.location.href).searchParams.get("ref");
      if (ref) storeReferral(ref);
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
