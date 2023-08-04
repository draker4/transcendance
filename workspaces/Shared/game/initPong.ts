import {
  InitData,
  GameData,
  Ball,
  Player,
  PlayerDynamic,
  Action,
} from "@transcendence/shared/types/Game.types";

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

export function initPlayerDynamic(
  side: "Left" | "Right",
  difficulty: -2 | -1 | 0 | 1 | 2,
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): PlayerDynamic {
  return {
    posX: side === "Left" ? PLAYER_WIDTH * 3 : GAME_WIDTH - PLAYER_WIDTH * 4,
    posY: GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2,
    speed: PLAYER_START_SPEED + difficulty + actualRound,
    move: Action.Idle,
    push: 0,
  };
}

export function initBall(
  difficulty: -2 | -1 | 0 | 1 | 2,
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
): Ball {
  return {
    posX: GAME_WIDTH / 2 - BALL_SIZE / 2,
    posY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
    speed: BALL_START_SPEED + difficulty + actualRound,
    moveX: 0,
    moveY: 0,
    push: 0,
  };
}

export function initPlayer(side: "Left" | "Right"): Player {
  return {
    id: -1,
    name: "Searching",
    color: { r: 0, g: 0, b: 0, a: 0 },
    avatar: {
      image: "",
      variant: "",
      borderColor: "",
      backgroundColor: "",
      text: "",
      empty: true,
      decrypt: false,
    },
    side,
    host: false,
  };
}

export function initPong(initData: InitData): GameData {
  return {
    id: initData.id,
    name: initData.name,
    ball: initBall(initData.difficulty, initData.actualRound),
    playerLeft: initPlayer("Left"),
    playerRight: initPlayer("Right"),
    playerLeftDynamic: initPlayerDynamic(
      "Left",
      initData.difficulty,
      initData.actualRound
    ),
    playerRightDynamic: initPlayerDynamic(
      "Right",
      initData.difficulty,
      initData.actualRound
    ),
    playerLeftStatus: "Unknown",
    playerRightStatus: "Unknown",
    background: initData.background,
    ballImg: initData.ball,
    type: initData.type,
    mode: initData.mode,
    hostSide: initData.hostSide,
    difficulty: initData.difficulty,
    push: initData.push,
    playerServe: Math.random() < 0.5 ? "Left" : "Right",
    actualRound: initData.actualRound,
    maxPoint: initData.maxPoint,
    maxRound: initData.maxRound,
    score: initData.score,
    timer: {
      end: 0,
      reason: "Start",
    },
    pause: {
      active: initData.pause,
      left: 3,
      right: 3,
      status: "None",
    },
    status: "Not Started",
    result: "Not Finished",
    sendStatus: false,
    updateScore: false,
  };
}
