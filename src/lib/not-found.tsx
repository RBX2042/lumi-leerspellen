import { Link } from "@tanstack/react-router";
import { Kicker } from "@/components/kicker";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md text-center">
        <Kicker>404</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium">Deze pagina is er niet.</h1>
        <p className="mt-3 text-sm text-muted">
          De link is kapot, of het spel is verhuisd. Terug naar huis is het veiligst.
        </p>
        <Button className="mt-8" asChild>
          <Link to="/">Naar Lumi</Link>
        </Button>
      </div>
    </main>
  );
}
