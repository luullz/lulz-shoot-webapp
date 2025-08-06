const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const bulletImg = new Image();
bulletImg.src = "bullet.png";

// Игрок
const player = {
  x: WIDTH / 2 - 32,
  y: HEIGHT - 80,
  width: 64,
  height: 64,
  speed: 4,
  bullets: []
};

// Враги
let enemies = [
  { x: 100, y: -64, width: 64, height: 64, speed: 2 }
];

// Управление
const keys = {};

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function shoot() {
  player.bullets.push({
    x: player.x + player.width / 2 - 8,
    y: player.y,
    width: 16,
    height: 16,
    speed: 6
  });
}

function update() {
  // Движение игрока
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < WIDTH) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y + player.height < HEIGHT) player.y += player.speed;
  if (keys["Space"]) {
    if (player.bullets.length === 0 || Date.now() - player.bullets[player.bullets.length - 1].spawnTime > 300) {
      const bullet = {
        x: player.x + player.width / 2 - 8,
        y: player.y,
        width: 16,
        height: 16,
        speed: 6,
        spawnTime: Date.now()
      };
      player.bullets.push(bullet);
    }
  }

  // Обновление пуль
  player.bullets.forEach(bullet => bullet.y -= bullet.speed);
  player.bullets = player.bullets.filter(b => b.y + b.height > 0);

  // Движение врагов
  enemies.forEach(enemy => enemy.y += enemy.speed);
  enemies = enemies.filter(e => e.y < HEIGHT);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Игрок
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Враги
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Пули
  player.bullets.forEach(bullet => {
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
