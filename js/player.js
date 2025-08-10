// js/player.js
export const player = {
  x: 0,
  y: 0,
  width: 64,
  height: 64,
  speed: 5,
  bullets: [],
  health: 3,
};

export function shootPlayerBullet() {
  player.bullets.push({
    x: player.x + player.width / 2 - 4,
    y: player.y,
    width: 8,
    height: 16,
    speed: 7
  });
}
