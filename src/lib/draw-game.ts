import { GAME_HEIGHT, GAME_WIDTH, type Game } from "@/lib/game";

const sprites = [
  ["0000111111110000", "0011111111111100", "0110111111101100", "1111111111111110", "1111001100111110", "1111111111111110", "0011100001110000", "0110010010011000", "1100000000001100"],
  ["0001110011100000", "0011111111110000", "0111111111111000", "1101111111101100", "1111111111111100", "0011111111110000", "0110100001011000", "1100010010001100", "0001100001100000"],
  ["0000011110000000", "0001111111100000", "0011111111110000", "0110111111011000", "1111111111111100", "1111111111111100", "0001100001100000", "0011001100110000", "0110000000011000"],
];

const playerSprite = [
  "00000000011000000000",
  "00000000111100000000",
  "00000000111100000000",
  "00001111111111110000",
  "00011111111111111000",
  "00111111111111111100",
  "01111111111111111110",
  "11111111111111111111",
  "11111111111111111111",
  "11111111111111111111",
  "11110011111100111111",
  "11000000000000000011",
];

export type Palette = {
  background: string;
  foreground: string;
  primary: string;
  accent: string;
  border: string;
  star: string;
  monster: [string, string, string];
  danger: string;
};

export function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  return {
    background: color("--background"), foreground: color("--foreground"),
    primary: color("--primary"), accent: color("--accent"), border: color("--border"),
    star: color("--star"), danger: color("--destructive"),
    monster: [color("--monster-a"), color("--monster-b"), color("--monster-c")],
  };
}

function drawSprite(ctx: CanvasRenderingContext2D, rows: string[], x: number, y: number, size = 2) {
  rows.forEach((row, rowIndex) => {
    for (let column = 0; column < row.length; column++) {
      if (row[column] === "1") ctx.fillRect(Math.round(x) + column * size, Math.round(y) + rowIndex * size, size, size);
    }
  });
}

export function drawGame(ctx: CanvasRenderingContext2D, game: Game, colors: Palette) {
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Repeatable star field, no mutable animation state or network assets.
  ctx.fillStyle = colors.star;
  for (let i = 0; i < 72; i++) {
    const x = (i * 137 + 39) % GAME_WIDTH;
    const y = (i * 223 + 27) % (GAME_HEIGHT - 52);
    ctx.globalAlpha = 0.25 + (i % 4) * 0.14;
    ctx.fillRect(x, y, i % 7 === 0 ? 3 : 2, i % 7 === 0 ? 3 : 2);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = colors.border;
  ctx.fillRect(0, 499, GAME_WIDTH, 2);
  for (let i = 0; i < GAME_WIDTH; i += 40) ctx.fillRect(i, 505, 16, 2);

  for (const monster of game.monsters) {
    if (!monster.alive) continue;
    ctx.fillStyle = colors.monster[monster.row];
    drawSprite(ctx, sprites[monster.row], monster.x, monster.y);
  }

  for (const shot of game.shots) {
    ctx.fillStyle = shot.enemy ? colors.danger : colors.accent;
    ctx.fillRect(Math.round(shot.x) - 2, Math.round(shot.y), 4, shot.enemy ? 12 : 16);
    ctx.fillRect(Math.round(shot.x) - 4, Math.round(shot.y) + 4, 8, 4);
  }

  if (game.invincible === 0 || Math.floor(game.invincible * 10) % 2 === 0) {
    ctx.fillStyle = colors.primary;
    drawSprite(ctx, playerSprite, game.playerX - 20, 450);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(Math.round(game.playerX) - 4, 446, 8, 4);
  }

  ctx.fillStyle = colors.foreground;
  ctx.globalAlpha = 0.12;
  for (let y = 0; y < GAME_HEIGHT; y += 4) ctx.fillRect(0, y, GAME_WIDTH, 1);
  ctx.globalAlpha = 1;
}
