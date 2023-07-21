import { initBall } from "./Ball";
import { initPlayer } from "./Player";

import { GAME_HEIGHT, GAME_WIDTH } from "@Shared/constants/Game.constants";
import { GameData } from "@Shared/types/Game.types";

export function initGame(gameData: GameData) {
  var game: GameData = {
    uuid: "", //TBD
    name: "", //TBD
    color: "#000000",
    fontColor: "#FFFFFF",
    roundColor: "#FFFFFF",
    roundWinColor: "#00FF00",
    menuFont: "20px Arial",
    scoreFont: "50px Arial",
    timerFont: "100px Arial",
    actualRound: 1,
    maxPoint: gameData.maxPoint,
    maxRound: gameData.maxRound,
    difficulty: gameData.difficulty,
    startTimer: 6,
    over: false,
    running: false,
    playerSide: gameData.playerSide,
    AI: gameData.AI,
    push: gameData.push,
    type: gameData.type,
    background: gameData.background,
    playerServe: gameData.playerServe,
    playerLeft: null,
    playerRight: null,
    ball: null,
    timer: 0,
    status: "Waiting",
    result: "Not Started",
  } as GameData;
  gameData.playerLeft = initPlayer(
    GAME_WIDTH,
    GAME_HEIGHT,
    "Left",
    gameData.difficulty - 1
  );
  game.playerRight = initPlayer(
    GAME_WIDTH,
    GAME_HEIGHT,
    "Right",
    gameData.difficulty - 1
  );
  game.ball = initBall(gameData.difficulty - 1);
  game.timer = new Date().getTime();
  if (Math.random() < 0.5) {
    game.playerServe = "Left";
  } else {
    game.playerServe = "Right";
  }
  handleStartTimer(game);
  return game;
}

export function resetGame(game: GameData) {
  game.color = "#000000";
  game.actualRound = 1;
  game.status = "Waiting";
  game.playerLeft = initPlayer(
    GAME_WIDTH,
    GAME_HEIGHT,
    "Left",
    game.difficulty
  );
  game.playerRight = initPlayer(
    GAME_WIDTH,
    GAME_HEIGHT,
    "Right",
    game.difficulty
  );
  game.ball = initBall(game.difficulty);
  game.timer = new Date().getTime();
  if (Math.random() < 0.5) {
    game.playerServe = "Left";
  } else {
    game.playerServe = "Right";
  }
  handleStartTimer(game);
}

function handleStartTimer(game: GameData) {
  if (game.timer > 0) {
    var timer = setInterval(() => {
      game.timer -= 1;
      if (game.timer === 0) {
        game.status = "Playing";
      }
      if (game.timer === 0) {
        clearInterval(timer);
      }
    }, 1000);
  }
}
