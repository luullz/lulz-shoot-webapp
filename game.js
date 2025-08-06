const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Загрузка спрайтов
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const playerBulletImg = new Image();
playerBulletImg.src = "bullet1.png";

const enemyBulletImg = new Image();
enemyBulletImg.src = "bullet.png";

// Игрок
const player = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    speed: 5,
    bullets: []
};

function positionPlayer() {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
}

// Масштаб под экран
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    positionPlayer();
    spawnEnemies();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Враги
let enemies = [];
let enemyBullets = [];
let wave = 1;
let enemyFireInterval = 2000;
let lastEnemyFireTime = 0;

// Управление
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);
document.addEventListener("keydown", e => {
    if (e.code === "Space") shootPlayerBullet();
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

function update(timestamp) {
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
    if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += player.speed;

    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    enemies.forEach(enemy => {
        enemy.y += 0.5;
    });

    if (timestamp - lastEnemyFireTime > enemyFireInterval) {
        enemies.forEach(enemy => shootEnemyBullet(enemy));
        lastEnemyFireTime = timestamp;
    }

    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    enemies.forEach(enemy => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    player.bullets.forEach(bullet => {
        ctx.drawImage(playerBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemyBullets.forEach(bullet => {
        ctx.drawImage(enemyBulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });

    ctx.font = "16px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`Волна ${wave}`, 10, 20);
}

function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

// ✅ Один блок загрузки изображений
let imagesToLoad = [playerImg, enemyImg, playerBulletImg, enemyBulletImg];
let imagesLoaded = 0;

imagesToLoad.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === imagesToLoad.length) {
            resizeCanvas();
            spawnEnemies();
            requestAnimationFrame(gameLoop);
        }
    };
});
