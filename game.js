const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastPlayerShotTime = 0;
const playerShotInterval = 300; // время между выстрелами в мс
let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;

let bgY = 0;
let bgScrollSpeed = 1;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
        isTouching = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isTouching && e.touches.length === 1) {
        let touchX = e.touches[0].clientX;
        let touchY = e.touches[0].clientY;

        let deltaX = touchX - lastTouchX;
        let deltaY = touchY - lastTouchY;

        player.x += deltaX;
        player.y += deltaY;

        // Ограничиваем движение в пределах канваса
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

        lastTouchX = touchX;
        lastTouchY = touchY;

        // Авто-стрельба при движении пальцем с контролем частоты выстрелов
        let now = performance.now();
        if (now - lastPlayerShotTime > playerShotInterval) {
            shootPlayerBullet();
            lastPlayerShotTime = now;
        }
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isTouching = false;
});



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

const backgroundImg = new Image();
backgroundImg.src = "background.png"; // или "images/background.jpg"


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

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
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

 // Проверка попаданий пуль игрока во врагов
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
        enemies.forEach(enemy => shootEnemyBullet(enemy));
        lastEnemyFireTime = timestamp;
    }

    // Прокрутка фона вниз
    bgY += bgScrollSpeed;
    if (bgY >= canvas.height) {
    bgY = 0;
    }

    // Пули врагов
    enemyBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) enemyBullets.splice(index, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Прокручиваем фон
ctx.drawImage(backgroundImg, 0, bgY - canvas.height, canvas.width, canvas.height);
ctx.drawImage(backgroundImg, 0, bgY, canvas.width, canvas.height);


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
