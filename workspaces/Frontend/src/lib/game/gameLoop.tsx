import { drawPong } from "./drawPong";
import { GameData, Draw, Player } from "@transcendence/shared/types/Game.types";

import {
  UpdateData,
  StatusMessage,
} from "@transcendence/shared/types/Message.types";

import { FRONT_FPS } from "@transcendence/shared/constants/Game.constants";

const lastTimestampRef = { current: 0 };
const lastFpsUpdateTimeRef = { current: 0 };
const frameCountRef = { current: 0 };
const fpsRef = { current: 0 };
const showFpsRef = false;

const updateMessage: UpdateData[] = [];
const playerMessage: Player[] = [];
const statusMessage: StatusMessage[] = [];

export const addUpdateMessage = (updateData: UpdateData) => {
  updateMessage.push(updateData);
};

export const addPlayerMessage = (playerData: Player) => {
  playerMessage.push(playerData);
};

export const addStatusMessage = (statusData: StatusMessage) => {
  statusMessage.push(statusData);
};

const updateGame = (game: GameData) => {
  if (updateMessage.length > 0) {
    const updateData = updateMessage.shift()!;
    const newGameData = { ...game };
    newGameData.playerLeftDynamic = updateData.playerLeftDynamic;
    newGameData.playerRightDynamic = updateData.playerRightDynamic;
    newGameData.ball = updateData.ball;
    newGameData.score = updateData.score;
    newGameData.actualRound = updateData.actualRound;
    game = newGameData;
  }
  if (playerMessage.length > 0) {
    const playerData = playerMessage.shift()!;
    const newGameData = { ...game };
    if (playerData.side === "Left") {
      newGameData.playerLeft = playerData;
    } else if (playerData.side === "Right") {
      newGameData.playerRight = playerData;
    }
    game = newGameData;
  }
  if (statusMessage.length > 0) {
    const statusData = statusMessage.shift()!;
    const newGameData = { ...game };
    newGameData.status = statusData.status;
    newGameData.result = statusData.result;
    newGameData.playerLeftStatus = statusData.playerLeft;
    newGameData.playerRightStatus = statusData.playerRight;
    newGameData.timer = statusData.timer;
    newGameData.pause = statusData.pause;
    game = newGameData;
  }
  return game;
};

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
    //updatePong(game);
    // Process the oldest update in the queue
    game = updateGame(game);
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
