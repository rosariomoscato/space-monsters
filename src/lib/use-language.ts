"use client";

import { useState, useSyncExternalStore } from "react";
import type { Language } from "@/lib/i18n";

const subscribe = () => () => {};
const browserLanguage = (): Language => navigator.language.toLowerCase().startsWith("it") ? "it" : "en";
const serverLanguage = (): Language => "it";

export function useLanguage() {
  const detected = useSyncExternalStore(subscribe, browserLanguage, serverLanguage);
  const [chosen, setChosen] = useState<Language | null>(null);
  return [chosen ?? detected, setChosen] as const;
}
