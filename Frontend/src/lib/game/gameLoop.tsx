import updatePong from "@Shared/Game/updatePong";
import drawPong from "./drawPong";
import { GameData, Draw } from "@Shared/Game/Game.type";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = false;

export const gameLoop = (timestamp: number, game: GameData, draw: Draw) => {
  const elapsedTime = timestamp - lastTimestampRef.current;
  frameCountRef.current++;

  if (elapsedTime >= 16.67) {
    if (game.status === "Playing") {
      updatePong(game);
    }
    drawPong(game, draw);

    lastTimestampRef.current = timestamp;
  }

  const currentTime = performance.now();
  const elapsedFpsTime = currentTime - lastFpsUpdateTimeRef.current;

  if (elapsedFpsTime >= 1000) {
    // Calculate FPS
    fpsRef.current = Math.round(
      (frameCountRef.current * 1000) / elapsedFpsTime
    );

    // Display FPS
    if (showFpsRef) console.log("FPS:", fpsRef.current);

    frameCountRef.current = 0;
    lastFpsUpdateTimeRef.current = currentTime;
  }

  const targetDelay = 1000 / 70; // 60 FPS
  const remainingDelay = Math.max(
    targetDelay - (performance.now() - timestamp),
    0
  );
  setTimeout(() => {
    requestAnimationFrame((timestamp) => gameLoop(timestamp, game, draw));
  }, remainingDelay);
};
