import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("the status overlay shares a content-sized grid track with the canvas", () => {
  const arcade = readFileSync(new URL("../src/components/arcade.tsx", import.meta.url), "utf8");
  assert.match(arcade, /className="grid overflow-hidden border-2[^\"]*"\s*>\s*<canvas[^>]*className="game-canvas col-start-1 row-start-1 block aspect-\[20\/13\] w-full"/);
  assert.match(arcade, /className="col-start-1 row-start-1 flex items-center justify-center [^\"]*p-3[^\"]*" role="status"/);
  assert.match(arcade, /<Button size="lg" onClick=\{hud\.phase === "paused" \? togglePause : start\} className="arcade-button min-h-12 w-full/);
});
