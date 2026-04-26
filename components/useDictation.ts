"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typing for the Web Speech API (Chrome/Safari/Edge; not Firefox).
type SRConstructor = new () => SpeechRecognitionInstance;
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

declare global {
  interface Window {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  }
}

const INTERIM_FADE_MS = 1200;

export function useDictation({
  onFinal,
}: {
  onFinal: (text: string) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const [interim, setInterim] = useState("");
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const onFinalRef = useRef(onFinal);
  const wantActiveRef = useRef(false);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // Auto-clear the interim line after a short pause in speech.
  useEffect(() => {
    if (!interim) return;
    const t = setTimeout(() => setInterim(""), INTERIM_FADE_MS);
    return () => clearTimeout(t);
  }, [interim]);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR || recRef.current) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const t = r[0].transcript;
        if (r.isFinal) {
          onFinalRef.current(t.trim() + " ");
        } else {
          interimText += t;
        }
      }
      if (interimText.trim()) setInterim(interimText.trim());
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantActiveRef.current = false;
        setActive(false);
      }
    };
    rec.onend = () => {
      // Browsers (esp. Safari) end recognition after silence — restart while the user wants it on.
      if (wantActiveRef.current && recRef.current === rec) {
        try {
          rec.start();
        } catch {
          // already started
        }
      } else {
        recRef.current = null;
        setActive(false);
        setInterim("");
      }
    };
    recRef.current = rec;
    wantActiveRef.current = true;
    try {
      rec.start();
      setActive(true);
    } catch {
      // already started — ignore
    }
  }, []);

  const stop = useCallback(() => {
    wantActiveRef.current = false;
    const rec = recRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (active) stop();
    else start();
  }, [active, start, stop]);

  return { supported, active, interim, toggle };
}
