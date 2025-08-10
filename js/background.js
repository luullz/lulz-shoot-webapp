// js/background.js
import { backgroundImg } from "./resources.js";

export let bgY = 0;
export let bgScrollSpeed = 1;

export function updateBackground(canvas) {
  bgY += bgScrollSpeed;
  if (bgY >= canvas.height) bgY = 0;
}

export function drawBackground(ctx, canvas) {
  // Рисуем две копии (без сохранения соотношения — растягиваем на весь canvas)
  ctx.drawImage(backgroundImg, 0, bgY - canvas.height, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, bgY, canvas.width, canvas.height);
}
