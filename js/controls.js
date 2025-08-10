export function setupControls(canvas, player, shootPlayerBullet) {
  // Автострельба — стреляем с интервалом (например, 300мс)
  let lastShotTime = 0;
  const shotInterval = 300;

  function tryShoot() {
    const now = performance.now();
    if (now - lastShotTime > shotInterval) {
      shootPlayerBullet();
      lastShotTime = now;
    }
  }

  // --- Управление мышью (ПК) ---
  let isMouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener("mousedown", e => {
    isMouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  canvas.addEventListener("mouseup", e => {
    isMouseDown = false;
  });

  canvas.addEventListener("mousemove", e => {
    if (!isMouseDown) return; // Двигаем только если зажали мышь

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Рассчитываем дельту движения мыши
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;

    // Двигаем игрока на дельту
    player.x += dx;
    player.y += dy;

    // Ограничение в пределах канваса
    player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
    player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    tryShoot();
  });

  // --- Управление пальцем (мобильные) ---
  let isTouching = false;
  let lastTouchX = 0;
  let lastTouchY = 0;

  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      isTouching = true;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
      tryShoot();
    }
  }, { passive: false });

  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (isTouching && e.touches.length === 1) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      const dx = touchX - lastTouchX;
      const dy = touchY - lastTouchY;

      player.x += dx;
      player.y += dy;

      // Ограничение
      player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
      player.y = Math.min(Math.max(player.y, 0), canvas.height - player.height);

      lastTouchX = touchX;
      lastTouchY = touchY;

      tryShoot();
    }
  }, { passive: false });

  canvas.addEventListener("touchend", e => {
    e.preventDefault();
    isTouching = false;
  }, { passive: false });
}
