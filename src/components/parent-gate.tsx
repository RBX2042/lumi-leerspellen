import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { checkPin } from "@/lib/lumi/server";

const UNLOCK_KEY = "lumi.parentOk";
const TTL = 20 * 60 * 1000;

function unlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const t = Number(window.sessionStorage.getItem(UNLOCK_KEY) ?? "0");
    return t > 0 && Date.now() - t < TTL;
  } catch {
    return false;
  }
}

function markUnlocked() {
  try {
    window.sessionStorage.setItem(UNLOCK_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function ParentLink({
  to,
  children,
  className,
  hasPin,
}: {
  to: "/ouders" | "/prijzen";
  children: ReactNode;
  className?: string;
  hasPin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const needs = hasPin && !unlocked();

  if (!needs) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open ? <PinModal onClose={() => setOpen(false)} to={to} /> : null}
    </>
  );
}

function PinModal({ onClose, to }: { onClose: () => void; to: "/ouders" | "/prijzen" }) {
  const nav = useNavigate();
  const [digits, setDigits] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function tryPin(code: string) {
    if (code.length !== 4) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await checkPin({ data: { pin: code } });
      if (r.ok) {
        markUnlocked();
        onClose();
        void nav({ to });
        return;
      }
      setDigits("");
      setErr("Dat is niet de code.");
    } catch {
      setErr("Even mis. Opnieuw.");
    } finally {
      setBusy(false);
    }
  }

  function press(d: string) {
    if (busy) return;
    const next = (digits + d).slice(0, 4);
    setDigits(next);
    if (next.length === 4) void tryPin(next);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface p-6 text-ink shadow-[var(--shadow-card)]">
        <p className="text-sm text-muted">Ouderzone</p>
        <h2 className="mt-1 font-display text-2xl">Vier cijfers</h2>
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <span
              key={i}
              className="grid size-10 place-items-center rounded-md bg-surface-2 font-display text-xl"
            >
              {digits[i] ? "•" : ""}
            </span>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k) =>
            k === "" ? (
              <span key="sp" />
            ) : (
              <button
                key={k}
                type="button"
                className="h-12 rounded-md bg-surface-2 text-lg font-medium hover:bg-primary-soft"
                onClick={() => {
                  if (k === "⌫") setDigits((d) => d.slice(0, -1));
                  else press(k);
                }}
              >
                {k}
              </button>
            ),
          )}
        </div>
        {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
        <Button variant="ghost" className="mt-4 w-full" onClick={onClose}>
          Terug spelen
        </Button>
      </div>
    </div>
  );
}
