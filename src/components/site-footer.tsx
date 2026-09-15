import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/lumi/brand";
import { LumiWordmark } from "./lumi-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <LumiWordmark />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {BRAND.name} — {BRAND.tagline}. Leerspellen voor de basisschool. Zonder reclame,
            zonder chat, zonder druk.
          </p>
        </div>
        <div className="flex gap-12 text-sm text-muted">
          <div className="grid gap-2">
            <Link to="/" hash="spellen" className="hover:text-ink">
              Spellen
            </Link>
            <Link to="/prijzen" className="hover:text-ink">
              Prijzen
            </Link>
            <Link to="/school" className="hover:text-ink">
              Voor school
            </Link>
            <Link to="/over" className="hover:text-ink">
              Over Lumi
            </Link>
            <Link to="/login" className="hover:text-ink">
              Inloggen
            </Link>
          </div>
          <div className="grid gap-2">
            <Link to="/hulp" className="hover:text-ink">
              Hulp
            </Link>
            <Link to="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link to="/voorwaarden" className="hover:text-ink">
              Voorwaarden
            </Link>
            <Link to="/cookies" className="hover:text-ink">
              Cookies
            </Link>
            <Link to="/merk" className="hover:text-ink">
              Logo en naam
            </Link>
            <Link to="/groei" className="hover:text-ink">
              Pad naar €2.000
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
