import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/voorwaarden")({ component: Voorwaarden });

function Voorwaarden() {
  return (
    <LegalPage kicker="Gebruik" title="Voorwaarden">
      <p>
        Lumi is bedoeld voor ouders en leerkrachten in Nederland. Door een account te maken ga je
        akkoord met deze afspraken. Alleen een volwassene van 18 jaar of ouder maakt een account.
      </p>
      <h2>Wat Lumi is</h2>
      <p>
        Korte leerspellen voor groep 1 tot 8. Geen huiswerkvervanger, geen officiële toets. De
        stof volgt kerndoelen, maar een ronde van tien vragen is oefening — geen rapportcijfer.
      </p>
      <h2>Account</h2>
      <p>
        Alleen een volwassene maakt een account. Kinderen spelen via een kindprofiel, zonder eigen
        inlog. Jij bent verantwoordelijk voor de speeltijd die je instelt. Zet een oudercode zodat
        een kind de ouderzone niet opent.
      </p>
      <h2>Abonnement</h2>
      <p>
        Ontdekker is gratis met limieten. Gezin, Plus en School zijn betaalde plannen. Tot iDEAL
        live is, kun je een plan activeren zonder afschrijving. De proef van 7 dagen is één keer
        per account. Opzeggen kan altijd in de ouderzone, in één tik. Na opzeggen val je terug op
        Ontdekker.
      </p>
      <h2>Gedrag</h2>
      <p>
        Geen misbruik van accounts, geen scrapen van de vragen, geen poging om de kind-omgeving te
        omzeilen voor andere kinderen dan die van jouw gezin of klas, behalve via School.
      </p>
      <h2>Aansprakelijkheid</h2>
      <p>
        We doen ons best, maar Lumi is “as is”: storing, verlies van voortgang of een verkeerd
        sommetje geeft geen recht op schadevergoeding boven het bedrag dat je die maand betaalde
        (tot iDEAL live is: nihil).
      </p>
      <h2>Wijzigingen</h2>
      <p>We mogen plannen, prijzen en deze tekst aanpassen. Blijvende wijziging van prijs kondigen we in de ouderzone aan.</p>
    </LegalPage>
  );
}
