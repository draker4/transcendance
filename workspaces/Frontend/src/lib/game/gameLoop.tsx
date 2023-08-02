import { updatePong } from "@transcendence/shared/game/updatePong";
import { drawPong } from "./drawPong";
import {
  GameData,
  Draw,
  UpdateData,
} from "@transcendence/shared/types/Game.types";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = true;

const updateQueueRef: UpdateData[] = []; // Array to store updates

export const addToUpdateQueue = (game: UpdateData) => {
  updateQueueRef.push(game);
};

export const gameLoop = (
  timestamp: number,
  game: GameData,
  draw: Draw,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  const elapsedTime = timestamp - lastTimestampRef.current;
  frameCountRef.current++;

  if (!isMountedRef.current) return;
  if (elapsedTime >= 16.67) {
    if (game.status === "Playing") {
      //updatePong(game);
      // Process the oldest update in the queue
      if (updateQueueRef.length > 0) {
        const updateData = updateQueueRef.shift()!;
        const newGameData = { ...game };
        newGameData.playerLeftDynamic = updateData.playerLeftDynamic;
        newGameData.playerRightDynamic = updateData.playerRightDynamic;
        newGameData.ball = updateData.ball;
        newGameData.score = updateData.score;
        game = newGameData;
      }
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

  const targetDelay = 1000 / 60; // 30 FPS
  const remainingDelay = Math.max(
    targetDelay - (performance.now() - timestamp),
    0
  );
  setTimeout(() => {
    requestAnimationFrame((timestamp) =>
      gameLoop(timestamp, game, draw, isMountedRef)
    );
  }, remainingDelay);
};
