import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/cookies")({ component: Cookies });

function Cookies() {
  return (
    <LegalPage kicker="Cookies" title="Cookies">
      <p>
        Lumi gebruikt alleen wat nodig is om je ingelogd te houden. Geen trackingcookies, geen
        marketingpixels, geen social plugins in de kind-omgeving.
      </p>
      <h2>Inlogsessie</h2>
      <p>
        Na inloggen zetten we een sessiecookie (of, in sommige previews, een sessietoken). Die is
        nodig om te weten dat jij het bent. Uitloggen wist die sessie.
      </p>
      <h2>Voorkeuren op dit apparaat</h2>
      <p>
        We onthouden lokaal of je de cookiemelding hebt gezien, of geluid uit staat, en welk
        kindprofiel als laatste speelde. Dat blijft op jouw apparaat. Geen derde partij.
      </p>
      <h2>Geen keuzehokjes voor ads</h2>
      <p>
        Omdat we geen tracking of reclame plaatsen, is er geen aparte “functioneel / marketing”
        schakelaar. De balk onderaan is ter info: begrepen, klaar.
      </p>
    </LegalPage>
  );
}
