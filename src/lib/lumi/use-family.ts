import { useCallback, useEffect, useState } from "react";
import { getFamily } from "./server";
import type { FamilySnapshot } from "./types";

export function useFamily() {
  const [data, setData] = useState<FamilySnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getFamily();
      setData(snap);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Kon gegevens niet laden";
      setError(msg);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, error, loading, reload };
}

const CHILD_KEY = "lumi.activeChild";

export function getActiveChildId(): number | null {
  if (typeof window === "undefined") return null;
  const v = window.sessionStorage.getItem(CHILD_KEY);
  return v ? Number(v) : null;
}

export function setActiveChildId(id: number | null) {
  if (typeof window === "undefined") return;
  if (id == null) window.sessionStorage.removeItem(CHILD_KEY);
  else window.sessionStorage.setItem(CHILD_KEY, String(id));
}
