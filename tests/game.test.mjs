import assert from "node:assert/strict";
import test from "node:test";
import { createGame, stepGame } from "../src/lib/game.ts";

const idle = { left: false, right: false, fire: false };

test("a new round starts with one complete formation and three lives", () => {
  const game = createGame();
  assert.equal(game.phase, "ready");
  assert.equal(game.monsters.length, 24);
  assert.equal(game.lives, 3);
  stepGame(game, { ...idle, fire: true }, 1);
  assert.equal(game.shots.length, 0);
});

test("shooting the final monster scores points and wins the round", () => {
  const game = createGame();
  game.phase = "playing";
  game.monsters.forEach((monster) => { monster.alive = false; });
  const last = game.monsters[0];
  last.alive = true;
  last.x = game.playerX - 30;
  last.y = 350;
  stepGame(game, { ...idle, fire: true }, 0.016);
  for (let index = 0; index < 25 && game.phase === "playing"; index++) stepGame(game, idle, 0.04);
  assert.equal(game.phase, "won");
  assert.equal(game.score, 30);
});

test("enemy shots cost one life at a time and finish the game on the third hit", () => {
  const game = createGame();
  game.phase = "playing";
  for (let hit = 0; hit < 3; hit++) {
    game.invincible = 0;
    game.shots = [{ x: game.playerX, y: 450, enemy: true }];
    stepGame(game, idle, 0.016);
    assert.equal(game.lives, 2 - hit);
  }
  assert.equal(game.phase, "lost");
});

test("a monster crossing the defense line ends the round", () => {
  const game = createGame();
  game.phase = "playing";
  game.monsters[0].y = 450;
  stepGame(game, idle, 0.016);
  assert.equal(game.phase, "lost");
});
