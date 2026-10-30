import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { copy } from "../src/lib/i18n.ts";

test("scoring legend translates ship-up row values in both languages", () => {
  assert.deepEqual(copy.it.scoringRows, [
    { label: "Prima fila", value: "10 punti" },
    { label: "Seconda fila", value: "20 punti" },
    { label: "Terza fila", value: "30 punti" },
  ]);
  assert.equal(copy.it.scoringDirection, "File contate dalla navicella verso l'alto.");
  assert.deepEqual(copy.en.scoringRows, [
    { label: "First row", value: "10 points" },
    { label: "Second row", value: "20 points" },
    { label: "Third row", value: "30 points" },
  ]);
  assert.equal(copy.en.scoringDirection, "Rows are counted from the ship upwards.");
});

test("the localized legend sits between the HUD and game field", () => {
  const arcade = readFileSync(new URL("../src/components/arcade.tsx", import.meta.url), "utf8");
  assert.match(arcade, /const text = copy\[language\]/);
  assert.match(arcade, /data-testid="remaining"[\s\S]*className="grid grid-cols-3 gap-2 border border-border bg-card p-3 sm:gap-4 sm:p-4" data-testid="scoring-legend"[\s\S]*text\.scoringRows\.map\(\(row, index\)[\s\S]*border-x border-border text-center[\s\S]*text-right[\s\S]*\{row\.label\}[\s\S]*\{row\.value\}[\s\S]*\{text\.scoringDirection\}[\s\S]*<canvas/);
});
