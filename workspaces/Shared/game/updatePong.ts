import { updatePlayer, moveAI } from "@transcendence/shared/game/handlePlayer";
import {
  resetBall,
  updateBall,
  handleServe,
} from "@transcendence/shared/game/handleBall";
import { GameData } from "@transcendence/shared/types/Game.types";
import {
  AI_ID,
  TIMER_ROUND,
} from "@transcendence/shared/constants/Game.constants";
import { defineTimer } from "./pongUtils";

function resetTurn(winner: "Left" | "Right", gameData: GameData) {
  resetBall(gameData.ball, gameData);
  gameData.playerServe = winner;

  const actualRound = gameData.actualRound;
  if (winner === "Left") {
    gameData.score.round[actualRound].left++;
  } else if (winner === "Right") {
    gameData.score.round[actualRound].right++;
  }
  gameData.updateScore = true;
}

function handleRound(gameData: GameData) {
  const actualRound = gameData.actualRound;
  const leftScore = gameData.score.round[actualRound].left;
  const rightScore = gameData.score.round[actualRound].right;
  //check if round is over
  if (leftScore === gameData.maxPoint || rightScore === gameData.maxPoint) {
    if (leftScore > rightScore) {
      gameData.score.leftRound++;
    } else if (leftScore < rightScore) {
      gameData.score.rightRound++;
    }
    //check if game is over
    if (
      gameData.score.leftRound > gameData.maxRound / 2 ||
      gameData.score.rightRound > gameData.maxRound / 2
    ) {
      gameData.status = "Finished";
      gameData.actualRound++;
      if (gameData.score.leftRound > gameData.score.rightRound) {
        if (gameData.playerLeft.host) gameData.result = "Host";
        else gameData.result = "Opponent";
      } else if (gameData.score.leftRound < gameData.score.rightRound) {
        if (gameData.playerLeft.host) gameData.result = "Opponent";
        else gameData.result = "Host";
      }
    } else {
      gameData.actualRound++;
      gameData.playerLeftDynamic.speed++;
      gameData.playerRightDynamic.speed++;
      gameData.ball.speed++;
      gameData.timer = defineTimer(TIMER_ROUND, "Round");
      if (gameData.pause.left < 3) gameData.pause.left++;
      if (gameData.pause.right < 3) gameData.pause.right++;
    }
    gameData.updateScore = true;
    gameData.sendStatus = true;
  }
}

function handleMovement(gameData: GameData): void {
  if (!gameData.playerLeft || !gameData.playerRight) return;
  if (gameData.mode === "Training") {
    if (gameData.playerLeft.id === AI_ID) {
      moveAI(
        gameData,
        gameData.playerRight,
        gameData.playerRightDynamic,
        gameData.ball
      );
      updatePlayer(gameData.playerRight, gameData.playerRightDynamic);
    } else if (gameData.playerLeft.id === AI_ID) {
      moveAI(
        gameData,
        gameData.playerLeft,
        gameData.playerLeftDynamic,
        gameData.ball
      );
      updatePlayer(gameData.playerLeft, gameData.playerLeftDynamic);
    }
  } else {
    updatePlayer(gameData.playerLeft, gameData.playerLeftDynamic);
    updatePlayer(gameData.playerRight, gameData.playerRightDynamic);
  }

  if (gameData.playerServe && gameData.status === "Playing") {
    handleServe(gameData.ball, gameData);
  }

  if (gameData.timer.end < new Date().getTime()) {
    const status = updateBall(gameData.ball, gameData);
    if (status === "reset Left") {
      resetTurn("Right", gameData);
    } else if (status === "reset Right") {
      resetTurn("Left", gameData);
    }
  }
}

export function updatePong(gameData: GameData) {
  handleMovement(gameData);
  handleRound(gameData);
}
