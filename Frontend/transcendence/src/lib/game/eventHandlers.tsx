import { Direction } from "@/lib/game/pongUtils";
import { resetGame } from "@/lib/game/handleGame";

export const pongKeyDown = (event: KeyboardEvent, game: Game) => {
  if (game.running) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (game.playerSide === "Right") {
        game.playerRight.move = Direction.Up;
      } else if (game.playerSide === "Left") {
        game.playerLeft.move = Direction.Up;
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (game.playerSide === "Right") {
        game.playerRight.move = Direction.Down;
      } else if (game.playerSide === "Left") {
        game.playerLeft.move = Direction.Down;
      }
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        if (game.playerSide === "Right" && game.playerRight.push === 0) {
          game.playerRight.push = 1;
        } else if (game.playerSide === "Left" && game.playerLeft.push === 0) {
          game.playerLeft.push = 1;
        }
      }
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (!game.over && game.startTimer === 0) {
      game.running = game.running === true ? false : true;
      console.log(game);
    } else if (game.over) {
      resetGame(game);
    }
  }
};

export const pongKeyUp = (event: KeyboardEvent, game: Game) => {
  if (game.playerSide === "Left") {
    game.playerLeft.move = Direction.Idle;
  } else {
    game.playerRight.move = Direction.Idle;
  }
};
