import type { ReactNode } from "react";
import { Kicker } from "@/components/kicker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">{title}</h1>
        <div className="mt-8 grid gap-6 text-sm leading-relaxed text-muted [&_h2]:mt-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-ink [&_strong]:text-ink">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
