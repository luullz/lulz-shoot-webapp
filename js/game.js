// js/game.js
import { player, shootPlayerBullet } from "./player.js";
import { enemies, spawnEnemies, shootEnemyBullet } from "./enemy.js";
import { updateBackground, drawBackground, bgY } from "./background.js";
import {  setupControls } from "./controls.js";
import { playerImg, enemyImg, playerBulletImg, enemyBulletImg, backgroundImg } from "./resources.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let enemyBullets = [];
let wave = 1;
let enemyFireInterval = 2000;
let lastEnemyFireTime = 0;
let gameOver = false;


function resizeCanvas() {
  canvas.width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  canvas.height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

// Ставим игрока внизу по центру
function positionPlayer() {
  player.x = canvas.width / 2 - player.width / 2;
  player.y = canvas.height - player.height - 20;
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function getPlayerHitbox() {
  return {
    x: player.x + 10,
    y: player.y + 10,
    width: player.width - 20,
    height: player.height - 20
  };
}

function update(timestamp) {
  if (gameOver) return;

  // Пули врагов
  enemyBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;

    const playerHitbox = getPlayerHitbox();

    if (isColliding(bullet, playerHitbox)) {
      enemyBullets.splice(index, 1);
      player.health -= 1;
      if (player.health <= 0) {
        gameOver = true;
        console.log("Игрок погиб!");
      }
    } else if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });

  // Пули игрока
  player.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) player.bullets.splice(index, 1);
  });

  // Движение врагов
  enemies.forEach(enemy => { enemy.y += 0.5; });

  // Попадания пуль игрока по врагам
  player.bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (isColliding(bullet, enemy)) {
        enemies.splice(eIndex, 1);
        player.bullets.splice(bIndex, 1);
      }
    });
  });

  // Стрельба врагов
  if (timestamp - lastEnemyFireTime > enemyFireInterval) {
    enemies.forEach(enemy => shootEnemyBullet(enemy, enemyBullets));
    lastEnemyFireTime = timestamp;
  }

  // Прокрутка фона
  updateBackground(canvas);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // фон
  drawBackground(ctx, canvas);

  // игрок
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // враги
  enemies.forEach(enemy => ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height));

  // пули игрока
  player.bullets.forEach(b => ctx.drawImage(playerBulletImg, b.x, b.y, b.width, b.height));

  // пули врагов
  enemyBullets.forEach(b => ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height));

  ctx.fillText(`Здоровье: ${player.health}`, 10, 40);



  // HUD
  ctx.font = "16px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(`Волна ${wave}`, 10, 20);
}

function gameLoop(timestamp) {
  if (!gameOver) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
  } else {

    ctx.fillStyle = "red";
    ctx.font = "48px monospace";
    ctx.fillText("Игра окончена", canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Ждём загрузки изображений — возвращает Promise
function waitForImages(images) {
  return new Promise(resolve => {
    let loaded = 0;
    images.forEach(img => {
      if (img.complete) {
        if (++loaded === images.length) resolve();
      } else {
        img.onload = () => { if (++loaded === images.length) resolve(); };
        img.onerror = () => { if (++loaded === images.length) resolve(); }; // не блокируем при ошибке
      }
    });
  });
}

export async function initGame() {
  // подгоняем canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // дождёмся картинок
  await waitForImages([playerImg, enemyImg, playerBulletImg, enemyBulletImg, backgroundImg]);

  positionPlayer();
  spawnEnemies(canvas);
  setupControls(canvas, player, shootPlayerBullet);
  requestAnimationFrame(gameLoop);
}
