import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { copy } from "../src/lib/i18n.ts";

test("row scoring copy is absent in both languages", () => {
  for (const language of ["it", "en"]) {
    assert.equal("scoringRows" in copy[language], false);
    assert.equal("scoringDirection" in copy[language], false);
  }
});

test("the HUD is followed directly by the game field", () => {
  const arcade = readFileSync(new URL("../src/components/arcade.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(arcade, /scoring-legend|scoringRows|scoringDirection/);
  assert.match(arcade, /data-testid="score"[\s\S]*data-testid="lives"[\s\S]*data-testid="remaining"[\s\S]*<\/div>\s*<\/div>\s*<div className="grid overflow-hidden[^\"]*">\s*<canvas/);
});
