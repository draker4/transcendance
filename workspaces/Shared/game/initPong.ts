import {
  InitData,
  GameData,
  Ball,
  Color,
  PlayerDynamic,
} from "@transcendence/shared/types/Game.types";

import { ScoreInfo } from "@transcendence/shared/types/Score.types";

// import constants
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  BALL_SIZE,
  BALL_START_SPEED,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_START_SPEED,
} from "@transcendence/shared/constants/Game.constants";

export function initPlayerDynamic(side: "Left" | "Right"): PlayerDynamic {
  return {
    posX: side === "Left" ? PLAYER_WIDTH * 3 : GAME_WIDTH - PLAYER_WIDTH * 4,
    posY: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
    speed: PLAYER_START_SPEED,
    move: "Idle",
    push: 0,
  };
}

export function initBall(): Ball {
  return {
    posX: GAME_WIDTH / 2 - BALL_SIZE / 2,
    posY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
    speed: BALL_START_SPEED,
    moveX: 0,
    moveY: 0,
    push: 0,
  };
}

export function initColor(background: string): Color {
  return {
    menu: { r: 0, g: 0, b: 0, a: 0.5 },
    font: { r: 255, g: 255, b: 255, a: 1 },
    roundWon: { r: 116, g: 200, b: 87, a: 1 },
  };
}

export function initPong(initData: InitData): GameData {
  return {
    id: initData.id,
    name: initData.name,
    ball: initBall(),
    playerLeft: null,
    playerRight: null,
    playerLeftDynamic: initPlayerDynamic("Left"),
    playerRightDynamic: initPlayerDynamic("Right"),
    playerLeftStatus: "Unknown",
    playerRightStatus: "Unknown",
    background: initData.background,
    ballImg: initData.ball,
    type: initData.type,
    mode: initData.mode,
    difficulty: initData.difficulty,
    push: initData.push,
    color: initColor(initData.background),
    playerServe: "Left", // revoir pour faire un random
    actualRound: 0,
    maxPoint: initData.maxPoint,
    maxRound: initData.maxRound,
    score: initData.score,
    timer: null,
    status: "Not Started",
    result: "Not Finished",
  };
}
