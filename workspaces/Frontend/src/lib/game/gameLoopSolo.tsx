import { drawPong } from "./drawPong";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import { updatePong } from "@transcendence/shared/game/updatePong";

import { FRONT_FPS } from "@transcendence/shared/constants/Game.constants";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = false;

export const gameLoop = (
  timestamp: number,
  game: GameData,
  draw: Draw,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  if (!isMountedRef.current) return;
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

  const remainingDelay = Math.max(
    FRONT_FPS - (performance.now() - timestamp),
    0
  );
  setTimeout(() => {
    requestAnimationFrame((timestamp) =>
      gameLoop(timestamp, game, draw, isMountedRef)
    );
  }, remainingDelay);
};
