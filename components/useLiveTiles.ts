"use client";

import { useEffect, useRef, useState } from "react";

type FetchOptions = {
  endpoint: string;
  draft: string;
  debounceMs?: number;
  minLength?: number;
};

export function useLiveTiles<T>(opts: FetchOptions): {
  data: T | null;
  pending: boolean;
  error: string | null;
} {
  const { endpoint, draft, debounceMs = 700, minLength = 12 } = opts;
  const [data, setData] = useState<T | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    const trimmed = draft.trim();
    if (trimmed.length < minLength) {
      setData(null);
      setPending(false);
      setError(null);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setPending(true);
      setError(null);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ draft }),
          signal: ctrl.signal,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? `Error ${res.status}`);
          return;
        }
        const json = (await res.json()) as T;
        setData(json);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (abortRef.current === ctrl) {
          setPending(false);
        }
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, endpoint, debounceMs, minLength]);

  return { data, pending, error };
}
