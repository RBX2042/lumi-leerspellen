import { createServerFn } from "@tanstack/react-start";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ReferralCapture } from "@/components/referral-capture";
import { CookieBar } from "@/components/cookie-bar";
import { NotFoundPage } from "@/lib/not-found";
import appCss from "../styles.css?url";

const fetchSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const u = await getSessionUser();
  return u ? { id: u.id, email: u.email } : null;
});

export const Route = createRootRoute({
  beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Lumi — leren dat blijft zitten" },
      {
        name: "description",
        content:
          "Leerzame spellen voor kinderen van 4 tot 12. Geen reclame. Eén gezinsabonnement. Ouders zien de voortgang.",
      },
      { name: "theme-color", content: "#C45C38" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Lexend:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="nl" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-ink">
        <PreviewHostBridge />
        <ReferralCapture />
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-md focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-fg"
        >
          Naar inhoud
        </a>
        <AuthProvider>
          <div id="inhoud" tabIndex={-1}>
            <Outlet />
          </div>
          <CookieBar />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

