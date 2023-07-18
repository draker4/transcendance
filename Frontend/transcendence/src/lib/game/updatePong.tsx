import { updatePlayer, moveAI } from "@/lib/game/handlePlayer";
import { resetBall, updateBall, handleServe } from "@/lib/game/handleBall";
import {
  generateRoundColor,
  turnDelayIsOver,
  DirX,
  DirY,
} from "@/lib/game/pongUtils";

function resetTurn(winner: "Left" | "Right", game: Game) {
  resetBall(game.ball, game);
  game.playerServe = winner;
  game.timer = new Date().getTime();

  if (winner === "Left") {
    game.playerLeft.score++;
  } else if (winner === "Right") {
    game.playerRight.score++;
  }
}

function handleRound(game: Game) {
  if (
    game.playerLeft.score === game.roundPoint ||
    game.playerRight.score === game.roundPoint
  ) {
    if (game.playerLeft.score > game.playerRight.score) {
      game.playerLeft.roundWon++;
    } else if (game.playerLeft.score < game.playerRight.score) {
      game.playerRight.roundWon++;
    }
    if (
      game.playerLeft.roundWon > game.roundMax / 2 ||
      game.playerRight.roundWon > game.roundMax / 2
    ) {
      game.over = true;
      if (game.playerLeft.roundWon > game.playerRight.roundWon) {
        game.result = "Left Player has won!";
      } else if (game.playerLeft.roundWon < game.playerRight.roundWon) {
        game.result = "Right Player has won!";
      }
    } else {
      game.color = generateRoundColor(game.color);
      game.playerLeft.score = game.playerRight.score = 0;
      game.playerLeft.speed = game.playerRight.speed += 1;
      game.ball.speed += 1;
      game.round += 1;
    }
  }
}

function handleMovement(game: Game): void {
  const { playerLeft, playerRight, ball } = game;
  if (game.AI) {
    if (game.playerSide === "Left") {
      updatePlayer(game, playerLeft);
      moveAI(game, playerRight, ball);
    } else if (game.playerSide === "Right") {
      updatePlayer(game, playerRight);
      moveAI(game, playerLeft, ball);
    }
  } else {
    updatePlayer(game, playerLeft);
    updatePlayer(game, playerRight);
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

export default function updatePong(game: Game) {
  handleMovement(game);
  handleRound(game);
}
