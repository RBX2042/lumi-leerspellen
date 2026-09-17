import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/lumi/brand";
import { LumiWordmark } from "./lumi-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <LumiWordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {BRAND.name} — {BRAND.tagline}. Leerspellen voor de basisschool. Zonder reclame,
            zonder chat, zonder druk.
          </p>
        </div>
        <div className="flex gap-12 text-sm text-muted">
          <div className="grid gap-2.5">
            <Link to="/" hash="spellen" className="transition-colors hover:text-ink">
              Spellen
            </Link>
            <Link to="/prijzen" className="transition-colors hover:text-ink">
              Prijzen
            </Link>
            <Link to="/school" className="transition-colors hover:text-ink">
              Voor school
            </Link>
            <Link to="/over" className="transition-colors hover:text-ink">
              Over Lumi
            </Link>
            <Link to="/login" className="transition-colors hover:text-ink">
              Inloggen
            </Link>
          </div>
          <div className="grid gap-2.5">
            <Link to="/hulp" className="transition-colors hover:text-ink">
              Hulp
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link to="/voorwaarden" className="transition-colors hover:text-ink">
              Voorwaarden
            </Link>
            <Link to="/cookies" className="transition-colors hover:text-ink">
              Cookies
            </Link>
            <Link to="/merk" className="transition-colors hover:text-ink">
              Logo en naam
            </Link>
            <Link to="/groei" className="transition-colors hover:text-ink">
              Pad naar €2.000
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
