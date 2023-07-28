import { updatePlayer, moveAI } from "@Shared/game/handlePlayer";
import { resetBall, updateBall, handleServe } from "@Shared/game/handleBall";
import { GameData } from "@Shared/types/Game.types";
import { AI_ID } from "@Shared/constants/Game.constants";

function resetTurn(winner: "Left" | "Right", gameData: GameData) {
  resetBall(gameData.ballDynamic, gameData);
  gameData.playerServe = winner;
  // gameData.timer = new Date().getTime();

  if (winner === "Left") {
    gameData.score.round[gameData.actualRound - 1].left++;
  } else if (winner === "Right") {
    gameData.score.round[gameData.actualRound - 1].right++;
  }
}

function handleRound(gameData: GameData) {
  const leftScore = gameData.score.round[gameData.actualRound - 1].left;
  const rightScore = gameData.score.round[gameData.actualRound - 1].right;
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
      gameData.ballDynamic.speed++;
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
        gameData.ballDynamic
      );
      updatePlayer(gameData.playerRight, gameData.playerRightDynamic);
    } else if (gameData.playerLeft.id === AI_ID) {
      moveAI(
        gameData,
        gameData.playerLeft,
        gameData.playerLeftDynamic,
        gameData.ballDynamic
      );
      updatePlayer(gameData.playerLeft, gameData.playerLeftDynamic);
    }
  } else {
    updatePlayer(gameData.playerLeft, gameData.playerLeftDynamic);
    updatePlayer(gameData.playerRight, gameData.playerRightDynamic);
  }

  if (gameData.playerServe) {
    handleServe(gameData.ballDynamic, gameData);
  }

  const status = updateBall(gameData.ballDynamic, gameData);
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
