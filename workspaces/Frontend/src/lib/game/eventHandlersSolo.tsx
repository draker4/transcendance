import { Action, GameData } from "@transcendence/shared/types/Game.types";

export const pongKeyDown = (
  event: KeyboardEvent,
  game: GameData,
  setGameData: Function
) => {
  if (game.status === "Playing") {
    // handle player move Up
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (game.playerRightDynamic.move !== "Up") {
        game.playerRightDynamic.move = Action.Up;
      } else if (game.playerLeftDynamic.move !== "Up") {
        game.playerLeftDynamic.move = Action.Up;
      }

      // handle player move Down
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (game.playerRightDynamic.move !== Action.Down) {
        game.playerRightDynamic.move = Action.Down;
      } else if (game.playerLeftDynamic.move !== Action.Down) {
        game.playerLeftDynamic.move = Action.Down;
      }

      // handle player push
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        if (game.playerRightDynamic.push === 0) {
          game.playerRightDynamic.push = 1;
        } else if (game.playerLeftDynamic.push === 0) {
          game.playerLeftDynamic.push = 1;
        }
      }
    }
  }

  // handle player start/stop
  if (event.key === "Enter") {
    event.preventDefault();
    if (game.status === "Stopped" || game.status === "Playing") {
      if (game.playerRightDynamic.move !== Action.Stop) {
        game.playerRightDynamic.move = Action.Stop;
      } else if (game.playerLeftDynamic.move !== Action.Stop) {
        game.playerLeftDynamic.move = Action.Stop;
      }
    }
  }
  setGameData(game);
};

export const pongKeyUp = (
  event: KeyboardEvent,
  game: GameData,
  setGameData: Function
) => {
  if (game.playerLeftDynamic.move !== Action.Idle) {
    game.playerLeftDynamic.move = Action.Idle;
  } else if (game.playerRightDynamic.move !== Action.Idle) {
    game.playerRightDynamic.move = Action.Idle;
  }
  setGameData(game);
};
