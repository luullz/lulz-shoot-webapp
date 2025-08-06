const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "assets/player.png";

const bulletImg = new Image();
bulletImg.src = "assets/bullet.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

let player = {
  x: canvas.width / 2 - 16,
  y: canvas.height - 60,
  width: 32,
  height: 32,
  speed: 5
};

let bullets = [];
let enemies = [];

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
  if (e.key === " ") {
    bullets.push({ x: player.x + 12, y: player.y });
  }
});

function update() {
  // Обновление пуль
  bullets.forEach(b => b.y -= 7);
  bullets = bullets.filter(b => b.y > 0);

  // Спавн врагов
  if (Math.random() < 0.02) {
    enemies.push({
      x: Math.random() * (canvas.width - 32),
      y: -32
    });
  }

  // Обновление врагов
  enemies.forEach(e => e.y += 2);
  enemies = enemies.filter(e => e.y < canvas.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y);

  bullets.forEach(b => ctx.drawImage(bulletImg, b.x, b.y));
  enemies.forEach(e => ctx.drawImage(enemyImg, e.x, e.y));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
