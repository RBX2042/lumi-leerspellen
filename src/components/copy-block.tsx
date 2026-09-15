import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyBlock({
  label,
  text,
  compact = false,
}: {
  label: string;
  text: string;
  compact?: boolean;
}) {
  const [ok, setOk] = useState(false);
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{label}</p>
        <Button
          size="sm"
          variant="secondary"
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(text);
            setOk(true);
            window.setTimeout(() => setOk(false), 1600);
          }}
        >
          {ok ? "Gekopieerd" : "Kopieer"}
        </Button>
      </div>
      {compact ? (
        <p className="mt-2 text-sm text-muted">{text}</p>
      ) : (
        <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap font-sans text-sm text-muted">
          {text}
        </pre>
      )}
    </div>
  );
}
