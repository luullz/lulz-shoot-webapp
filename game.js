const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Враги — перенесены вверх, чтобы избежать ошибки инициализации
let enemies = [];
let enemyBullets = [];
let wave = 1;
let enemyFireInterval = 2000;
let lastEnemyFireTime = 0;

// Игрок
const player = {
    x: 0,
    y: 0,
    width: 64,
    height: 64,
    speed: 5,
    bullets: []
};

// Загрузка спрайтов
const playerImg = new Image();
playerImg.src = "player.png";

const enemyImg = new Image();
enemyImg.src = "enemy.png";

const playerBulletImg = new Image();
playerBulletImg.src = "bullet1.png"; // Пуля игрока (8x16)

const enemyBulletImg = new Image();
enemyBulletImg.src = "bullet.png"; // Пуля врага (16x16)

// Масштабируем под экран устройства
function resizeCanvas() {
    canvas.width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    canvas.height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    positionPlayer();
    spawnEnemies();
}


// Установка позиции игрока по центру низа
function positionPlayer() {
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 20;
}

// Спавн врагов
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

// Управление
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Стрельба игрока по пробелу
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

function update(timestamp) {
    // Управление игроком
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

    // Пули игрока
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // Движение врагов
    enemies.forEach(enemy => {
        enemy.y += 0.5;
    });

    // Стрельба врагов
    if (timestamp - lastEnemyFireTime > enemyFireInterval) {
        enemies.forEach(enemy => shootEnemyBullet(enemy));
        lastEnemyFireTime = timestamp;
    }

    // Пули врагов
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

    // Волна
    ctx.font = "16px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`Волна ${wave}`, 10, 20);
}

function gameLoop(timestamp) {
    update(timestamp);
    draw();
    requestAnimationFrame(gameLoop);
}

// Адаптация под экран
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ждём загрузки всех изображений
let imagesToLoad = [playerImg, enemyImg, playerBulletImg, enemyBulletImg];
let imagesLoaded = 0;

imagesToLoad.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === imagesToLoad.length) {
            resizeCanvas();  // Ещё раз на всякий случай
            spawnEnemies();
            requestAnimationFrame(gameLoop);
        }
    };
});
