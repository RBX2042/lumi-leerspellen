import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const KEY = "lumi.cookies.ok";

export function CookieBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(window.localStorage.getItem(KEY) !== "1");
    } catch {
      setShow(false);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Lumi gebruikt alleen een inlogcookie. Geen tracking, geen ads.{" "}
          <Link to="/cookies" className="text-ink underline">
            Cookies
          </Link>
          {" · "}
          <Link to="/privacy" className="text-ink underline">
            Privacy
          </Link>
        </p>
        <Button
          size="sm"
          onClick={() => {
            try {
              window.localStorage.setItem(KEY, "1");
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
        >
          Begrepen
        </Button>
      </div>
    </div>
  );
}
