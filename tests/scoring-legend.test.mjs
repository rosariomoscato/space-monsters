import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { copy } from "../src/lib/i18n.ts";

test("scoring legend translates ship-up row values in both languages", () => {
  assert.equal(copy.it.scoringLegend, "Prima fila: 10 punti · Seconda fila: 20 punti · Terza fila: 30 punti.");
  assert.equal(copy.it.scoringDirection, "File contate dalla navicella verso l'alto.");
  assert.equal(copy.en.scoringLegend, "First row: 10 points · Second row: 20 points · Third row: 30 points.");
  assert.equal(copy.en.scoringDirection, "Rows are counted from the ship upwards.");
});

test("the localized legend sits between the HUD and game field", () => {
  const arcade = readFileSync(new URL("../src/components/arcade.tsx", import.meta.url), "utf8");
  assert.match(arcade, /const text = copy\[language\]/);
  assert.match(arcade, /data-testid="remaining"[\s\S]*data-testid="scoring-legend"[\s\S]*\{text\.scoringLegend\}[\s\S]*\{text\.scoringDirection\}[\s\S]*<canvas/);
});
