import { updatePlayer, moveAI } from "@transcendence/shared/game/handlePlayer";
import {
  resetBall,
  updateBall,
  handleServe,
} from "@transcendence/shared/game/handleBall";
import { GameData } from "@transcendence/shared/types/Game.types";
import { AI_ID } from "@transcendence/shared/constants/Game.constants";

function resetTurn(winner: "Left" | "Right", gameData: GameData) {
  resetBall(gameData.ball, gameData);
  gameData.playerServe = winner;

  const actualRound = gameData.actualRound > 0 ? gameData.actualRound - 1 : 0;
  if (winner === "Left") {
    gameData.score.round[actualRound].left++;
  } else if (winner === "Right") {
    gameData.score.round[actualRound].right++;
  }
}

function handleRound(gameData: GameData) {
  const actualRound = gameData.actualRound > 0 ? gameData.actualRound - 1 : 0;
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
      if (gameData.score.leftRound > gameData.score.rightRound) {
        gameData.result = "Player1";
      } else if (gameData.score.leftRound < gameData.score.rightRound) {
        gameData.result = "Player2";
      }
    } else {
      gameData.actualRound++;
      gameData.playerLeftDynamic.speed++;
      gameData.playerRightDynamic.speed++;
      gameData.ball.speed++;
    }
  }
}

function handleMovement(gameData: GameData): void {
  if (!gameData.playerLeft || !gameData.playerRight) return;
  if (gameData.type === "Training") {
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

  const status = updateBall(gameData.ball, gameData);
  if (status === "reset Left") {
    resetTurn("Right", gameData);
  } else if (status === "reset Right") {
    resetTurn("Left", gameData);
  }
}

export function updatePong(gameData: GameData) {
  handleMovement(gameData);
  handleRound(gameData);
}
