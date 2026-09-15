import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { submitHelpMessage } from "@/lib/lumi/server";

export const Route = createFileRoute("/hulp")({ component: Hulp });

function Hulp() {
  const { user } = useCurrentUserState();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Kicker>Hulp</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">Vragen, opzeggen, privacy</h1>
        <dl className="mt-10 grid gap-8">
          {[
            {
              q: "Hoe zeg ik op?",
              a: "Ouderzone → Opzeggen. Bevestigen, klaar. Geen mail, geen wachttijd. Daarna val je terug op Ontdekker.",
            },
            {
              q: "Ziet mijn kind de ouderzone?",
              a: "Zet een pincode van vier cijfers. Stoppen vanuit een spel vraagt die code. Zonder code is de ouderzone open — zet hem dus.",
            },
            {
              q: "Betaal ik nu al?",
              a: "iDEAL is nog niet gekoppeld. Plannen kun je activeren om alles te testen, zonder afschrijving. Zodra iDEAL live is, zie je dat in de ouderzone vóór je iets verschuldigd bent.",
            },
            {
              q: "Kan ik de proef vaker starten?",
              a: "Nee. Zeven dagen, één keer per account. Daarna Ontdekker of Gezin.",
            },
            {
              q: "Wat als twee kinderen verschillende groepen hebben?",
              a: "Elk profiel heeft een eigen groep en niveau. Gezin dekt tot vier kinderen. School tot dertig, met klas in één keer toevoegen.",
            },
            {
              q: "Hoe wis of download ik onze gegevens?",
              a: "Ouderzone, onderaan: Download gegevens of Account verwijderen. Verwijderen is definitief.",
            },
            {
              q: "Werkt dit op de telefoon?",
              a: "Ja. De kind-omgeving is gemaakt voor een telefoon in de hand. Toetsen 1 tot 4 werken op een toetsenbord.",
            },
          ].map((x) => (
            <div key={x.q}>
              <dt className="font-medium">{x.q}</dt>
              <dd className="mt-2 text-sm text-muted">{x.a}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-14 font-display text-2xl">Schrijf ons</h2>
        {user ? (
          <HelpForm />
        ) : (
          <Card className="mt-4 rounded-xl p-5">
            <p className="text-sm text-muted">Log in zodat we je bericht aan het juiste account kunnen hangen.</p>
            <Button className="mt-4" asChild>
              <Link to="/login" search={{ next: "/hulp" }}>
                Inloggen
              </Link>
            </Button>
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function HelpForm() {
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await submitHelpMessage({ data: { note } });
      setNote("");
      setMsg("Binnen. We lezen het.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Mislukt");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Card className="mt-4 rounded-xl p-5">
      <form className="grid gap-3" onSubmit={onSubmit}>
        <Label htmlFor="hulp">Bericht</Label>
        <textarea
          id="hulp"
          required
          minLength={8}
          maxLength={800}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-32 rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
        {msg ? <p className="text-sm text-ok">{msg}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Bezig…" : "Versturen"}
        </Button>
      </form>
    </Card>
  );
}
