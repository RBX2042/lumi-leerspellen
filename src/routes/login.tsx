import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LumiMark } from "@/components/lumi-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { storeReferral } from "@/components/referral-capture";

type Search = { next?: string; ref?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s.next === "string" ? s.next : undefined,
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
  component: Login,
});

function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/ouders";
  return next;
}

function dutchAuthError(message: string, fallback: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid email or password") || m.includes("invalid password")) {
    return "E-mail of wachtwoord klopt niet.";
  }
  if (m.includes("already exists") || m.includes("user already")) {
    return "Dit e-mailadres heeft al een account. Log in.";
  }
  if (m.includes("password") && (m.includes("too short") || m.includes("min"))) {
    return "Kies een wachtwoord van minstens 8 tekens.";
  }
  if (m.includes("invalid email") || m.includes("email is invalid")) {
    return "Vul een geldig e-mailadres in.";
  }
  return fallback;
}

function Login() {
  const { next, ref } = Route.useSearch();
  const dest = safeNext(next);
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [brokerOk, setBrokerOk] = useState(false);

  useEffect(() => {
    if (ref) storeReferral(ref);
  }, [ref]);

  useEffect(() => {
    setBrokerOk(window.location.hostname.endsWith(".grok-sandbox.com"));
  }, []);

  useEffect(() => {
    if (!isPending && user) {
      window.location.assign(dest);
    }
  }, [isPending, user, dest]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "up" && !agree) {
      setError("Bevestig dat je 18+ bent en akkoord gaat.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0]!,
        });
        if (err) throw new Error(dutchAuthError(err.message || "", "Account maken mislukt"));
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(dutchAuthError(err.message || "", "Inloggen mislukt"));
      }
      window.location.href = dest;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-bg px-4 py-10">
      <div className="pointer-events-none absolute inset-0 lumi-wash" />
      <div className="relative w-full max-w-md rounded-3xl bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-8">
        <Link to="/" className="mb-8 flex items-center gap-2.5 text-ink">
          <LumiMark className="size-9" />
          <span className="font-display text-2xl font-medium">Lumi</span>
        </Link>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {mode === "up" ? "Maak een ouderaccount" : "Welkom terug"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Kinderen spelen. Jij ziet wat ze leren. Geen reclame, geen account voor het kind.
        </p>
        {authEnabled && brokerOk ? (
          <div className="mt-6 grid gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  if (mode === "up" && !agree) {
                    setError("Bevestig dat je 18+ bent en akkoord gaat.");
                    return;
                  }
                  signIn(p.providerId, { callbackURL: dest });
                }}
              >
                Verder met {p.label}
              </Button>
            ))}
          </div>
        ) : null}
        {authEnabled && brokerOk ? (
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-faint">
          <span className="h-px flex-1 bg-border" />
          of met e-mail
          <span className="h-px flex-1 bg-border" />
        </div>
        ) : (
          <div className="mt-6" />
        )}
        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === "up" ? (
            <div className="grid gap-1.5">
              <Label htmlFor="name">Jouw naam</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          ) : null}
          <div className="grid gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Wachtwoord</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "up" ? "new-password" : "current-password"} />
          </div>
          {mode === "up" ? (
            <label className="flex items-start gap-3 text-sm text-muted">
              <input type="checkbox" className="mt-1 size-4 accent-[var(--color-primary)]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                Ik ben 18 jaar of ouder (ouder, voogd of leerkracht) en ga akkoord met de{" "}
                <Link to="/voorwaarden" className="text-ink underline">voorwaarden</Link>{" "}en{" "}
                <Link to="/privacy" className="text-ink underline">privacy</Link>.
              </span>
            </label>
          ) : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={busy} className="w-full" size="lg">
            {busy ? "Even geduld…" : mode === "up" ? "Account maken" : "Inloggen"}
          </Button>
        </form>
        <button type="button" className="mt-4 text-sm text-muted hover:text-ink" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? "Heb je al een account? Inloggen" : "Nog geen account? Maak er een"}
        </button>
      </div>
    </main>
  );
}
