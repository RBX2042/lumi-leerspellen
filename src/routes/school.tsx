import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Kicker } from "@/components/kicker";
import { CopyBlock } from "@/components/copy-block";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BRAND, PRICE, euro } from "@/lib/lumi/brand";
import { COPY, teacherText } from "@/lib/lumi/copykit";
import { startTrial, submitSchoolLead } from "@/lib/lumi/server";

export const Route = createFileRoute("/school")({ component: School });

function School() {
  const { user } = useCurrentUserState();
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <Kicker>Voor de klas</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Eén klas. Alle spellen. {euro(PRICE.school)} per maand.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {BRAND.name} voor groep 1 tot 8. Tot 30 leerlingen, geen reclame, voortgang per
          kind. Ouders oefenen thuis door — dat is hoe een klas ook gezinnen meeneemt.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Tot 30 profielen", "Elk kind eigen groep en niveau."],
            ["Kerndoelen NL", "Tafels, spelling, breuken, klok, topo."],
            ["Thuislink", "Ouders zetten hetzelfde pad voort."],
          ].map(([t, b]) => (
            <Card key={t} className="rounded-xl p-5">
              <p className="font-display text-xl">{t}</p>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {user ? (
            <>
              <Button size="lg" asChild>
                <Link to="/afrekenen" search={{ plan: "school" }}>
                  Activeer School
                </Link>
              </Button>
            </>
          ) : (
            <Button size="lg" asChild>
              <Link to="/login" search={{ next: "/afrekenen?plan=school" }}>
                7 dagen klasproef
              </Link>
            </Button>
          )}
        </div>
        <p className="mt-3 text-sm text-faint">Of {euro(PRICE.schoolYear)} per jaar — twee maanden cadeau.</p>

        <h2 className="mt-16 font-display text-2xl">Vraag een klasproef aan</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Schoolnaam is genoeg. We zetten je account klaar voor tot 30 leerlingen.
        </p>
        <SchoolForm signedIn={!!user} />

        <h2 className="mt-16 font-display text-2xl">Stuur dit naar een juf</h2>
        <div className="mt-4 grid gap-4">
          <TeacherCopies />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SchoolForm({ signedIn }: { signedIn: boolean }) {
  const [school, setSchool] = useState("");
  const [groep, setGroep] = useState("groep4");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!signedIn) {
    return (
      <Card className="mt-4 rounded-xl p-5">
        <p className="text-sm text-muted">Log in als leerkracht om een klasproef vast te leggen.</p>
        <Button className="mt-4" asChild>
          <Link to="/login" search={{ next: "/school" }}>
            Inloggen
          </Link>
        </Button>
      </Card>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await submitSchoolLead({ data: { school, groep, note } });
      try {
        await startTrial();
        setMsg("Aanvraag staat. Proef is aan — voeg leerlingen toe in de ouderzone.");
      } catch {
        setMsg("Aanvraag staat. Voeg leerlingen toe in de ouderzone. Activeer School bij afrekenen.");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Mislukt");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-4 rounded-xl p-5">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="school">School</Label>
          <Input id="school" required maxLength={80} value={school} onChange={(e) => setSchool(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="groep">Groep</Label>
          <select
            id="groep"
            className="h-11 rounded-md border border-border bg-surface px-3"
            value={groep}
            onChange={(e) => setGroep(e.target.value)}
          >
            {["groep1", "groep2", "groep3", "groep4", "groep5", "groep6", "groep7", "groep8"].map((g) => (
              <option key={g} value={g}>
                {g.replace("groep", "Groep ")}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="note">Toelichting (optioneel)</Label>
          <textarea
            id="note"
            maxLength={400}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-24 rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        {msg ? <p className="text-sm text-ok sm:col-span-2">{msg}</p> : null}
        <Button type="submit" disabled={busy} className="sm:col-span-2">
          {busy ? "Bezig…" : "Klasproef aanvragen"}
        </Button>
      </form>
    </Card>
  );
}

function TeacherCopies() {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return (
    <>
      <CopyBlock label="WhatsApp" text={teacherText(origin)} />
      <CopyBlock label={COPY.emailJufSubject} text={COPY.emailJuf} />
    </>
  );
}
