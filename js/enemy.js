// js/enemy.js
export let enemies = [];

export function spawnEnemies(canvas) {
  enemies = [];
  const count = 5;
  const spacing = (canvas.width - count * 64) / (count + 1);

  for (let i = 0; i < count; i++) {
    enemies.push({
      x: spacing + i * (64 + spacing),
      y: 50,
      width: 64,
      height: 64,
      speed: 2
    });
  }
}

export function shootEnemyBullet(enemy, enemyBullets) {
  enemyBullets.push({
    x: enemy.x + enemy.width / 2 - 8,
    y: enemy.y + enemy.height,
    width: 16,
    height: 16,
    speed: 1
  });
}
