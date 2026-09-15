import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const FALLBACK_MESSAGE = "Er ging iets mis. Probeer de pagina opnieuw te laden.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-ink">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-medium">Even vastgelopen</h1>
      <p className="max-w-md text-sm break-words text-muted">{errorMessage(error)}</p>
      <Button className="mt-4" asChild>
        <Link to="/">Terug naar Lumi</Link>
      </Button>
    </main>
  );
}
