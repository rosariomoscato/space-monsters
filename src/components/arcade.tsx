"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crosshair, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { drawGame, readPalette } from "@/lib/draw-game";
import { copy } from "@/lib/i18n";
import { useLanguage } from "@/lib/use-language";
import { createGame, GAME_HEIGHT, GAME_WIDTH, stepGame, type Game, type Input } from "@/lib/game";

type Hud = { phase: Game["phase"]; score: number; lives: number; remaining: number };

function hudFor(game: Game): Hud {
  return { phase: game.phase, score: game.score, lives: game.lives, remaining: game.monsters.filter((monster) => monster.alive).length };
}

function TouchControl({ control, onTouch, label, className, children }: {
  control: keyof Input;
  onTouch: (control: keyof Input, pointerId: number, down: boolean) => void;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Button variant={control === "fire" ? "secondary" : "outline"} className={className} aria-label={label}
      onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); onTouch(control, event.pointerId, true); }}
      onPointerUp={(event) => onTouch(control, event.pointerId, false)}
      onPointerCancel={(event) => onTouch(control, event.pointerId, false)}
      onLostPointerCapture={(event) => onTouch(control, event.pointerId, false)}>
      {children}
    </Button>
  );
}

export function Arcade({ showSystemLink = false }: { showSystemLink?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialGame] = useState(createGame);
  const gameRef = useRef(initialGame);
  const inputRef = useRef<Input>({ left: false, right: false, fire: false });
  const touchRef = useRef<Record<keyof Input, Set<number>>>({ left: new Set(), right: new Set(), fire: new Set() });
  const [hud, setHud] = useState<Hud>({ phase: "ready", score: 0, lives: 3, remaining: 24 });
  const [language, setLanguage] = useLanguage();
  const text = copy[language];

  const publish = useCallback(() => setHud(hudFor(gameRef.current)), []);

  const start = useCallback(() => {
    gameRef.current = createGame();
    gameRef.current.phase = "playing";
    publish();
  }, [publish]);

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (game.phase === "playing") {
      game.phase = "paused";
      inputRef.current = { left: false, right: false, fire: false };
    } else if (game.phase === "paused") game.phase = "playing";
    publish();
  }, [publish]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const key = (event: KeyboardEvent, down: boolean) => {
      const name = event.key.toLowerCase();
      if (name === " " && event.target instanceof HTMLElement && event.target.closest("button, a, input, select, textarea")) return;
      if (["arrowleft", "arrowright", " ", "a", "d", "p"].includes(name)) event.preventDefault();
      if (name === "arrowleft" || name === "a") inputRef.current.left = down || touchRef.current.left.size > 0;
      if (name === "arrowright" || name === "d") inputRef.current.right = down || touchRef.current.right.size > 0;
      if (name === " ") {
        inputRef.current.fire = down || touchRef.current.fire.size > 0;
        if (down && gameRef.current.phase === "ready") {
          gameRef.current.phase = "playing";
          publish();
        }
      }
      if (name === "p" && down && !event.repeat) togglePause();
    };
    const down = (event: KeyboardEvent) => key(event, true);
    const up = (event: KeyboardEvent) => key(event, false);
    const blur = () => {
      inputRef.current = { left: false, right: false, fire: false };
      if (gameRef.current.phase === "playing") {
        gameRef.current.phase = "paused";
        publish();
      }
    };
    const visibility = () => { if (document.hidden) blur(); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [publish, togglePause]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const colors = readPalette(canvas);
    let frame: number;
    let last = performance.now();
    let lastHud = last;
    let lastPhase = gameRef.current.phase;
    const loop = (time: number) => {
      stepGame(gameRef.current, inputRef.current, (time - last) / 1000);
      last = time;
      drawGame(ctx, gameRef.current, colors);
      if (gameRef.current.phase !== lastPhase || gameRef.current.phase === "playing" && time - lastHud > 100) {
        publish();
        lastHud = time;
        lastPhase = gameRef.current.phase;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [publish]);

  const touch = (control: keyof Input, pointerId: number, down: boolean) => {
    if (down) touchRef.current[control].add(pointerId);
    else touchRef.current[control].delete(pointerId);
    inputRef.current[control] = touchRef.current[control].size > 0;
  };

  const overlay = hud.phase === "ready" || hud.phase === "paused" || hud.phase === "won" || hud.phase === "lost";
  const headline = hud.phase === "ready" ? text.ready : hud.phase === "paused" ? text.paused : hud.phase === "won" ? text.won : text.lost;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8">
      <header className="flex items-start justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs font-bold tracking-[0.22em] text-accent">✳ {text.eyebrow}</span>
          <h1 className="pixel-title text-xl leading-relaxed text-primary sm:text-3xl">SPACE<br className="sm:hidden" /> MONSTERS<span className="text-accent">_</span></h1>
          <p className="text-sm text-muted-foreground sm:text-base">{text.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 border border-border bg-card p-1" aria-label="Language / Lingua">
          {(["it", "en"] as const).map((code) => (
            <Button key={code} variant={language === code ? "default" : "ghost"} size="sm" aria-label={code === "it" ? "Italiano" : "English"} aria-pressed={language === code} onClick={() => setLanguage(code)} className="arcade-button text-xs">
              {code.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>

      <section className="flex flex-col gap-3" aria-label="Space Monsters">
        <div className="grid grid-cols-3 gap-2 border border-border bg-card p-3 sm:gap-4 sm:p-4">
          <div><div className="text-xs tracking-wider text-muted-foreground">{text.score}</div><div className="pixel-title mt-2 text-sm text-primary sm:text-xl" data-testid="score">{String(hud.score).padStart(4, "0")}</div></div>
          <div className="border-x border-border text-center"><div className="text-xs tracking-wider text-muted-foreground">{text.lives}</div><div className="pixel-title mt-2 text-sm text-accent sm:text-xl" data-testid="lives">{hud.lives}</div></div>
          <div className="text-right"><div className="text-xs tracking-wider text-muted-foreground">{text.remaining}</div><div className="pixel-title mt-2 text-sm text-foreground sm:text-xl" data-testid="remaining">{hud.remaining}</div></div>
        </div>

        <div className="relative overflow-hidden border-2 border-border bg-background shadow-[0_0_0_4px_var(--card)]">
          <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="game-canvas block aspect-[20/13] w-full" aria-label={language === "it" ? "Campo di gioco di Space Monsters" : "Space Monsters game field"} role="img" />
          {overlay ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-3 backdrop-blur-[2px]" role="status" aria-live="polite">
              <div className="arcade-grid flex w-full max-w-md flex-col items-center gap-4 border border-accent bg-card/95 p-5 text-center shadow-[8px_8px_0_var(--background)] sm:gap-6 sm:p-8">
                <span className="text-xl text-accent" aria-hidden="true">✦ ✦ ✦</span>
                <h2 className="pixel-title text-sm leading-loose text-primary sm:text-xl">{headline}</h2>
                {hud.phase !== "paused" ? <p className="text-sm text-foreground">{hud.phase === "ready" ? text.readyDetail : hud.phase === "won" ? text.wonDetail : text.lostDetail}</p> : null}
                <Button size="lg" onClick={hud.phase === "paused" ? togglePause : start} className="arcade-button min-h-12 w-full text-xs sm:w-auto sm:px-6">
                  {hud.phase === "paused" ? <Play data-icon="inline-start" /> : hud.phase === "ready" ? <Play data-icon="inline-start" /> : <RotateCcw data-icon="inline-start" />}
                  {hud.phase === "paused" ? text.resume : hud.phase === "ready" ? text.start : text.again}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">{text.noSave}</p>
          <Button variant="outline" size="sm" onClick={togglePause} disabled={hud.phase === "ready" || hud.phase === "won" || hud.phase === "lost"} className="arcade-button text-xs">
            {hud.phase === "paused" ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
            {hud.phase === "paused" ? text.resume : text.pause}
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="hidden border border-border bg-card p-5 md:block">
          <h2 className="pixel-title mb-4 text-xs text-accent">01 / {text.keyboard}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{text.keyboardHelp}</p>
        </section>
        <section className="border border-border bg-card p-5">
          <h2 className="pixel-title mb-4 text-xs text-accent">02 / {text.touch}</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{text.touchHelp}</p>
          <div className="flex gap-3">
            <TouchControl control="left" onTouch={touch} className="touch-button h-16 flex-1 border-accent/50" label={text.left}><ArrowLeft aria-hidden="true" /></TouchControl>
            <TouchControl control="right" onTouch={touch} className="touch-button h-16 flex-1 border-accent/50" label={text.right}><ArrowRight aria-hidden="true" /></TouchControl>
            <TouchControl control="fire" onTouch={touch} className="touch-button arcade-button h-16 flex-[1.6] border border-primary text-xs text-primary" label={text.fireLabel}><Crosshair data-icon="inline-start" />{text.fire}</TouchControl>
          </div>
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground">
        <p>{text.credit} <a href="https://rosmoscato.xyz" target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-4 hover:text-primary">Rosario Moscato</a>.</p>
        {showSystemLink ? <a href="/settings/system" className="text-accent underline underline-offset-4 hover:text-primary">{text.system}</a> : null}
        <span className="pixel-title text-[0.6rem] text-primary">SPACE MONSTERS ©</span>
      </footer>
    </main>
  );
}
