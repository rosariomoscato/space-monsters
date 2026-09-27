"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/lib/use-language";

export function SystemInfo({ canonicalReady }: { canonicalReady: boolean }) {
  const [language, setLanguage] = useLanguage();
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const text = copy[language];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="pixel-title text-xs text-primary hover:text-accent">← SPACE MONSTERS</Link>
          <h1 className="pixel-title text-lg leading-loose">{text.system}</h1>
        </div>
        <div className="flex gap-1 border border-border p-1" aria-label="Language / Lingua">
          {(["it", "en"] as const).map((code) => <Button key={code} size="sm" variant={language === code ? "default" : "ghost"} aria-pressed={language === code} onClick={() => setLanguage(code)}>{code.toUpperCase()}</Button>)}
        </div>
      </div>
      <p className="text-muted-foreground">{text.systemDescription}</p>
      <div className="flex flex-wrap justify-between gap-4 border border-border bg-card p-5">
        <span>{text.canonical}</span>
        <span className={canonicalReady ? "text-primary" : "text-muted-foreground"}>{canonicalReady ? text.configured : text.missing}</span>
      </div>
    </main>
  );
}
