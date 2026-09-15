import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/lumi/brand";
import { dutchGameCount } from "@/lib/lumi/catalog";

export const Route = createFileRoute("/over")({ component: Over });

function Over() {
  return (
    <LegalPage kicker="Over" title={`${BRAND.name} — ${BRAND.tagline}`}>
      <p>
        {BRAND.name} is een Nederlandse leerapp voor groep 1 tot 8. {dutchGameCount(true)} korte spellen: rekenen,
        tafels, letters, spelling, klokkijken, geld, breuken, zinnen, patronen, werkgeheugen en topografie. Geen reclame,
        geen chat, geen beloningswinkel.
      </p>
      <h2>Voor wie</h2>
      <p>
        Ouders van 28 tot 45 met kinderen in de basisschool. Mensen die al betalen voor zwemles
        of muziek, en schermtijd willen die niet leeg is. Niet voor peuters, niet voor de
        middelbare school. Groep 1 tot 8 — daar zit de huiswerkstress.
      </p>
      <h2>Tegen wie</h2>
      <p>
        Tegen Squla als je twee kinderen hebt: zij rekenen per kind. Tegen Khan Academy Kids als
        je Nederlandse spelling, klokkijken of topo wilt. Tegen YouTube Kids als je geen feed
        wilt die nooit stopt. Lumi is kort, gestopt, en van een volwassene.
      </p>
      <h2>Waarom deze vorm</h2>
      <p>
        Ouders betalen al voor schermtijd. Wij maken die tijd verantwoord: retrieval practice, een
        pad dat zich aanpast, en een ouderzone met minuten in plaats van een eindeloze feed.
      </p>
      <h2>Contact</h2>
      <p>
        Vragen, opzeggen of gegevens wissen: via de hulppagina in de app. We lezen berichten die aan
        een ingelogd account hangen.
      </p>
      <p className="mt-6">
        <Button asChild>
          <Link to="/hulp">Naar hulp</Link>
        </Button>
      </p>
    </LegalPage>
  );
}
