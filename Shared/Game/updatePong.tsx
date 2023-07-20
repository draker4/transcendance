import { updatePlayer, moveAI } from "@Shared/Game/handlePlayer";
import { resetBall, updateBall, handleServe } from "@Shared/Game/handleBall";
import { generateRoundColor, turnDelayIsOver } from "@Shared/Game/pongUtils";
import { GameData } from "@Shared/Game/Game.type";

function resetTurn(winner: "Left" | "Right", game: GameData) {
  resetBall(game.ball, game);
  game.playerServe = winner;
  game.timer = new Date().getTime();

  if (winner === "Left") {
    game.playerLeft.score++;
  } else if (winner === "Right") {
    game.playerRight.score++;
  }
}

function handleRound(game: GameData) {
  if (
    game.playerLeft.score === game.maxPoint ||
    game.playerRight.score === game.maxPoint
  ) {
    if (game.playerLeft.score > game.playerRight.score) {
      game.playerLeft.roundWon++;
    } else if (game.playerLeft.score < game.playerRight.score) {
      game.playerRight.roundWon++;
    }
    if (
      game.playerLeft.roundWon > game.maxRound / 2 ||
      game.playerRight.roundWon > game.maxRound / 2
    ) {
      game.status = "Finished";
      if (game.playerLeft.roundWon > game.playerRight.roundWon) {
        game.result = "Player1";
      } else if (game.playerLeft.roundWon < game.playerRight.roundWon) {
        game.result = "Player2";
      }
    } else {
      game.color = generateRoundColor(game.color);
      game.playerLeft.score = game.playerRight.score = 0;
      game.playerLeft.speed = game.playerRight.speed += 1;
      game.ball.speed += 1;
      game.actualRound += 1;
    }
  }
}

function handleMovement(game: GameData): void {
  const { playerLeft, playerRight, ball } = game;
  if (game.AI) {
    if (game.playerSide === "Left") {
      updatePlayer(playerLeft);
      moveAI(game, playerRight, ball);
    } else if (game.playerSide === "Right") {
      updatePlayer(playerRight);
      moveAI(game, playerLeft, ball);
    }
  } else {
    updatePlayer(playerLeft);
    updatePlayer(playerRight);
  }

  if (turnDelayIsOver(game.timer) && game.playerServe) {
    handleServe(ball, game);
  }

  if (turnDelayIsOver(game.timer)) {
    const status = updateBall(ball, game);
    if (status === "reset Left") {
      resetTurn("Right", game);
    } else if (status === "reset Right") {
      resetTurn("Left", game);
    }
  }
}

export default function updatePong(game: GameData) {
  handleMovement(game);
  handleRound(game);
}
