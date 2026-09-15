import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <LegalPage kicker="AVG" title="Privacy">
      <p>
        Lumi is een leerapp voor kinderen van 4 tot 12 jaar. Een ouder of leerkracht maakt het
        account. Kinderen krijgen geen eigen inlog, geen chat en geen open profiel.
      </p>
      <h2>Wie is verantwoordelijk</h2>
      <p>
        De exploitant van Lumi is verwerkingsverantwoordelijke. Vragen over gegevens stuur je via
        de hulppagina in de app. Er is geen tracking van derden, geen advertentienetwerk.
      </p>
      <h2>Welke gegevens</h2>
      <p>
        <strong>Account:</strong> naam, e-mail, inlog via Google, X of wachtwoord.
        <br />
        <strong>Kindprofiel:</strong> voornaam, leeftijd, groep, gekozen dier, speeltijdlimiet.
        <br />
        <strong>Voortgang:</strong> scores, niveau, minuten, datum van een sessie.
        <br />
        <strong>Abonnement:</strong> gekozen plan, proefperiode, eventuele doorverwijscode.
      </p>
      <h2>Waarom</h2>
      <p>
        Om het account te laten werken, het kind te laten spelen op het juiste niveau, de ouder
        inzicht te geven, en het abonnement te beheren. Grondslag: uitvoering van de overeenkomst
        en, waar nodig, gerechtvaardigd belang (beveiliging, misbruik tegengaan).
      </p>
      <h2>Bewaartermijn</h2>
      <p>
        Speeldata horen bij het account. Je kunt in de ouderzone je gegevens downloaden of het
        account zelf wissen. Dan verwijderen we kindprofielen, sessies en inloggegevens, behalve
        wat we wettelijk even moeten bewaren (bijvoorbeeld een betaalbewijs zodra iDEAL live is).
      </p>
      <h2>Delen</h2>
      <p>
        We verkopen geen gegevens. Hosting en inloggen lopen via onze infrastructuur (database en
        inlogdiensten). Geen social plugins in de kind-omgeving. Geen ads.
      </p>
      <h2>Rechten</h2>
      <p>
        Je kunt inzage (download in de ouderzone), correctie of verwijdering doen. Je kunt een
        klacht indienen bij de Autoriteit Persoonsgegevens. Kinderen onder 16: de ouder oefent de
        rechten uit.
      </p>
      <h2>Cookies</h2>
      <p>
        Alleen een inlogsessie en een paar voorkeuren op dit apparaat. Geen trackingcookies, geen
        marketingpixels. Zie de cookiepagina.
      </p>
    </LegalPage>
  );
}
