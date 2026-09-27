export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 520;

export type Phase = "ready" | "playing" | "paused" | "won" | "lost";
export type Input = { left: boolean; right: boolean; fire: boolean };
export type Monster = { x: number; y: number; row: number; alive: boolean };
export type Shot = { x: number; y: number; enemy: boolean };

export type Game = {
  phase: Phase;
  playerX: number;
  monsters: Monster[];
  shots: Shot[];
  direction: 1 | -1;
  score: number;
  lives: number;
  elapsed: number;
  fireCooldown: number;
  enemyCooldown: number;
  invincible: number;
};

const PLAYER_Y = 462;
const MONSTER_WIDTH = 32;
const MONSTER_HEIGHT = 24;

export function createGame(): Game {
  return {
    phase: "ready",
    playerX: GAME_WIDTH / 2,
    monsters: Array.from({ length: 24 }, (_, index) => ({
      x: 104 + (index % 8) * 76,
      y: 78 + Math.floor(index / 8) * 52,
      row: Math.floor(index / 8),
      alive: true,
    })),
    shots: [],
    direction: 1,
    score: 0,
    lives: 3,
    elapsed: 0,
    fireCooldown: 0,
    enemyCooldown: 1.5,
    invincible: 0,
  };
}

export function stepGame(game: Game, input: Input, delta: number): void {
  if (game.phase !== "playing") return;
  const dt = Math.min(delta, 0.05);
  game.elapsed += dt;
  game.fireCooldown = Math.max(0, game.fireCooldown - dt);
  game.enemyCooldown -= dt;
  game.invincible = Math.max(0, game.invincible - dt);

  const motion = Number(input.right) - Number(input.left);
  game.playerX = Math.max(28, Math.min(GAME_WIDTH - 28, game.playerX + motion * 320 * dt));

  if (input.fire && game.fireCooldown === 0) {
    game.shots.push({ x: game.playerX, y: PLAYER_Y - 19, enemy: false });
    game.fireCooldown = 0.25;
  }

  const alive = game.monsters.filter((monster) => monster.alive);
  const speed = 38 + (24 - alive.length) * 2.4;
  if (alive.some((monster) => monster.x + game.direction * speed * dt < 16 || monster.x + MONSTER_WIDTH + game.direction * speed * dt > GAME_WIDTH - 16)) {
    game.direction = game.direction === 1 ? -1 : 1;
    for (const monster of game.monsters) monster.y += 18;
  } else {
    for (const monster of game.monsters) monster.x += game.direction * speed * dt;
  }

  if (alive.some((monster) => monster.y + MONSTER_HEIGHT >= PLAYER_Y - 8)) {
    game.phase = "lost";
    return;
  }

  if (game.enemyCooldown <= 0 && alive.length > 0) {
    // Only the bottom monster in a column can shoot.
    const column = Math.floor(Math.random() * 8);
    const shooter = [...alive].reverse().find((monster) => game.monsters.indexOf(monster) % 8 === column)
      ?? alive[Math.floor(Math.random() * alive.length)];
    game.shots.push({ x: shooter.x + MONSTER_WIDTH / 2, y: shooter.y + MONSTER_HEIGHT, enemy: true });
    game.enemyCooldown = Math.max(0.55, 1.65 - game.elapsed * 0.008);
  }

  for (const shot of game.shots) {
    shot.y += (shot.enemy ? 240 : -430) * dt;
    if (shot.enemy) {
      if (game.invincible === 0 && Math.abs(shot.x - game.playerX) < 19 && shot.y >= PLAYER_Y - 14 && shot.y <= PLAYER_Y + 16) {
        shot.y = GAME_HEIGHT + 100;
        game.lives -= 1;
        game.invincible = 1.4;
        if (game.lives === 0) game.phase = "lost";
      }
    } else {
      for (const monster of game.monsters) {
        if (monster.alive && shot.x >= monster.x && shot.x <= monster.x + MONSTER_WIDTH && shot.y >= monster.y && shot.y <= monster.y + MONSTER_HEIGHT) {
          monster.alive = false;
          game.score += (3 - monster.row) * 10;
          shot.y = -100;
          break;
        }
      }
    }
  }
  game.shots = game.shots.filter((shot) => shot.y > -10 && shot.y < GAME_HEIGHT + 10);
  if (game.monsters.every((monster) => !monster.alive)) game.phase = "won";
}
