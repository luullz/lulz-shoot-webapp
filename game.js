const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 640;

// Загрузка спрайтов
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const playerBulletImg = new Image();
playerBulletImg.src = "bullet1.png"; // Пуля игрока (8x16)

const enemyBulletImg = new Image();
enemyBulletImg.src = "bullet.png"; // Пуля врага (16x16)

// Игрок
const player = {
    x: canvas.width / 2 - 32,
    y: canvas.height - 80,
    width: 64,
    height: 64,
    speed: 5,
    bullets: []
};

// Враги
let enemies = [];
let enemyBullets = [];
let wave = 1;
let enemyFireInterval = 2000; // Каждые 2 секунды враги стреляют
let lastEnemyFireTime = 0;

// Управление
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Стрельба игрока
document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        shootPlayerBullet();
    }
});

function shootPlayerBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 4,
        y: player.y,
        width: 8,
        height: 16,
        speed: 7
    });
}

function shootEnemyBullet(enemy) {
    enemyBullets.push({
        x: enemy.x + enemy.width / 2 - 8,
        y: enemy.y + enemy.height,
        width: 16,
        height: 16,
        speed: 3
    });
}

function spawnEnemies() {
    enemies = [];
    for (let i = 0; i < 5; i++) {
        enemies.push({
            x: 50 + i * 80,
            y: 50,
            width: 64,
            height: 64,
            speed: 2
        });
    }
}

function update(timestamp) {
    // Движение игрока
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (keys["ArrowUp"] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys["ArrowDown"] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Движение пуль игрока
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // Движение врагов
    enemies.forEach(enemy => {
        enemy.y += 0.5;
    });

    // Вражеская стрельба
    if (timestamp - lastEnemyFireTime > enemyFireInterval) {
        enemies.forEach(enemy => shootEnemyBullet(enemy));
        lastEnemyFireTime = timestamp;
    }

    // Движение вражеских пуль
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Игрок
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Враги
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Пули игрока
    player.bullets.forEach(bullet => {
        ctx.drawImage(playerBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Пули врагов
    enemyBullets.forEach(bullet => {
        ctx.drawImage(enemyBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Текст волны
    ctx.font = "16px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`Волна ${wave}`, 10, 20);
}

function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

// Старт
spawnEnemies();
requestAnimationFrame(gameLoop);
