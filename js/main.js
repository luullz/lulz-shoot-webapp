// js/main.js
import { initGame } from "./game.js";

const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const canvas = document.getElementById("gameCanvas");

function pressAnimation() {
  startBtn.classList.add("pressed");
  setTimeout(() => {
    startBtn.classList.remove("pressed");
  }, 150);
}

let gameStarted = false;

async function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  menu.style.display = "none";
  canvas.style.display = "block";
  await initGame();
}

startBtn.addEventListener("click", async () => {
  pressAnimation();
  await new Promise(resolve => setTimeout(resolve, 150));
  await startGame();
});

startBtn.addEventListener("touchstart", () => {
  pressAnimation();
});
startBtn.addEventListener("touchend", async () => {
  await new Promise(resolve => setTimeout(resolve, 150));
  await startGame();
});


