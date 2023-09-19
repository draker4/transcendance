import { drawPong } from "./drawPong";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import { defineTimer } from "@transcendence/shared/game/pongUtils";
import {
  TIMER_RESTART,
  TIMER_PAUSE,
  FRONT_FPS,
  GAME_WIDTH,
  GAME_HEIGHT,
  BALL_SIZE,
} from "@transcendence/shared/constants/Game.constants";
import { updatePong } from "@transcendence/shared/game/updatePong";
import {
  updateDBScore,
  updateDBStatus,
  updateDBStats,
  updateDBPause,
  updateDBStory,
} from "./updateDB";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = false;
let gameLoopRunning = true;
let pauseLoopRunning: "Left" | "Right" | null = null;
let ballX: number = GAME_WIDTH / 2 - BALL_SIZE / 2;
let ballY: number = GAME_HEIGHT / 2 - BALL_SIZE / 2;

function pauseCheck(side: "Left" | "Right", gameData: GameData) {
  const actualTime = new Date().getTime();
  if (actualTime >= gameData.timer.end) {
    gameData.status = "Playing";
    gameData.timer = defineTimer(
      TIMER_RESTART,
      "ReStart",
      side === "Left" ? gameData.playerLeft.name : gameData.playerRight.name
    );
    gameData.sendStatus = true;
    pauseLoopRunning = null;
  }
}

export function startPause(side: "Left" | "Right", gameData: GameData) {
  if (!pauseLoopRunning) {
    gameData.status = "Stopped";
    gameData.sendStatus = true;
    gameData.updatePause = true;
    gameData.timer = defineTimer(
      TIMER_PAUSE,
      "Pause",
      side === "Left" ? gameData.playerLeft.name : gameData.playerRight.name
    );
    pauseLoopRunning = side;
  }
}

export function stopPause(side: "Left" | "Right", gameData: GameData) {
  gameData.status = "Playing";
  gameData.sendStatus = true;
  gameData.timer = defineTimer(
    TIMER_RESTART,
    "ReStart",
    side === "Left" ? gameData.playerLeft.name : gameData.playerRight.name
  );
  pauseLoopRunning = null;
}

function lerp(start: number, end: number): number {
  const delta = end - start;
  return start + delta * (frameCountRef.current / 30);
}

export const gameLoop = (
  timestamp: number,
  game: GameData,
  setGameData: Function,
  draw: Draw,
  isMountedRef: React.MutableRefObject<boolean>,
  demo: boolean
) => {
  if (!isMountedRef.current || !gameLoopRunning) return;
  const elapsedTime = timestamp - lastTimestampRef.current;
  const updatedGame = { ...game };
  if (elapsedTime >= FRONT_FPS) {
    frameCountRef.current++;
    if (updatedGame.status === "Playing") {
      ballX = game.ball.posX;
      ballY = game.ball.posY;
      updatePong(updatedGame);
      if (updatedGame.updateScore) {
        if (!demo) updateDBScore(updatedGame);
        updatedGame.updateScore = false;
      }
    }
    if (pauseLoopRunning) {
      pauseCheck(pauseLoopRunning, updatedGame);
    }
    if (updatedGame.sendStatus) {
      if (!demo) updateDBStatus(updatedGame);
      updatedGame.sendStatus = false;
      if (updatedGame.status === "Finished") {
        gameLoopRunning = false;
        if (!demo) updateDBStats(updatedGame);
        if (updatedGame.type === "Story") {
          if (!demo) updateDBStory(updatedGame);
        }
      }
    }
    if (updatedGame.updatePause) {
      if (!demo) updateDBPause(updatedGame);
      updatedGame.updatePause = false;
    }
    setGameData(updatedGame);
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
    if (
      process.env &&
      process.env.ENVIRONNEMENT &&
      process.env.ENVIRONNEMENT === "dev" &&
      showFpsRef
    )
      console.log("FPS:", fpsRef.current);

    frameCountRef.current = 0;
    lastFpsUpdateTimeRef.current = currentTime;
  }

  ballX = lerp(ballX, game.ball.posX);
  ballY = lerp(ballY, game.ball.posY);

  drawPong(game, draw, ballX, ballY);

  requestAnimationFrame((timestamp) =>
    gameLoop(timestamp, updatedGame, setGameData, draw, isMountedRef, demo)
  );
};
