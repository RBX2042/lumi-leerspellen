import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { BRAND } from "@/lib/lumi/brand";
import { LumiWordmark } from "./lumi-mark";

export function SiteHeader({ dim = false }: { dim?: boolean }) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  return (
    <header
      className={
        dim
          ? "sticky top-0 z-30 border-b border-border bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm"
          : "sticky top-0 z-30 border-b border-border bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm"
      }
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4">
        <Link to="/" className="shrink-0" aria-label={BRAND.name} onClick={() => setOpen(false)}>
          <LumiWordmark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          <Link to="/" hash="spellen" className="hover:text-ink">
            Spellen
          </Link>
          <Link to="/" hash="aiwijs" className="hover:text-ink">
            AI-wijs
          </Link>
          <Link to="/huiswerk" className="hover:text-ink">
            Huiswerk
          </Link>
          <Link to="/prijzen" className="hover:text-ink">
            Prijzen
          </Link>
          <Link to="/school" className="hover:text-ink">
            Voor school
          </Link>
          <Link to="/over" className="hover:text-ink">
            Over
          </Link>
          <Link to="/hulp" className="hover:text-ink">
            Hulp
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-surface-2" />
          ) : user ? (
            <>
              <Link
                to="/spelen"
                className="hidden h-11 items-center rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 sm:inline-flex"
              >
                Spelen
              </Link>
              <Link
                to="/ouders"
                className="hidden h-11 items-center rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 sm:inline-flex"
              >
                Ouderzone
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden h-11 items-center rounded-full px-3 text-sm font-medium text-ink hover:bg-surface-2 sm:inline-flex"
              >
                Inloggen
              </Link>
              <Link
                to="/login"
                search={{ next: "/ouders" }}
                className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-primary px-3 text-sm font-medium text-primary-fg shadow-[0_10px_22px_-12px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] sm:px-4"
              >
                <span className="sm:hidden">Gratis</span>
                <span className="hidden sm:inline">30 dagen gratis</span>
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-surface-2 md:hidden"
            aria-label={open ? "Menu sluiten" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm md:hidden">
          <Link to="/" hash="spellen" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Spellen
          </Link>
          <Link to="/" hash="aiwijs" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            AI-wijs
          </Link>
          <Link to="/huiswerk" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Huiswerk
          </Link>
          <Link to="/prijzen" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Prijzen
          </Link>
          <Link to="/school" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Voor school
          </Link>
          <Link to="/hulp" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Hulp
          </Link>
          <Link to="/over" className="flex h-11 items-center" onClick={() => setOpen(false)}>
            Over
          </Link>
          {user ? (
            <Link to="/spelen" className="flex h-11 items-center" onClick={() => setOpen(false)}>
              Spelen
            </Link>
          ) : null}
          {user ? (
            <Link to="/ouders" className="flex h-11 items-center" onClick={() => setOpen(false)}>
              Ouderzone
            </Link>
          ) : (
            <Link to="/login" className="flex h-11 items-center" onClick={() => setOpen(false)}>
              Inloggen
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}
