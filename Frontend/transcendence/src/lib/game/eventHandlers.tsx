import { Action, GameData } from "@Shared/Game/Game.type";
import { Socket } from "socket.io-client";

export const pongKeyDown = (
  event: KeyboardEvent,
  game: GameData,
  gameId: string,
  socket: Socket
) => {
  if (game.status === "Playing") {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (game.playerSide === "Right") {
        game.playerRight.move = Action.Up;
      } else if (game.playerSide === "Left") {
        game.playerLeft.move = Action.Up;
      }
      socket.emit("action", { gameId: gameId, action: Action.Up });
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (game.playerSide === "Right") {
        game.playerRight.move = Action.Down;
      } else if (game.playerSide === "Left") {
        game.playerLeft.move = Action.Down;
      }
      socket.emit("action", { gameId: gameId, action: Action.Down });
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        if (game.playerSide === "Right" && game.playerRight.push === 0) {
          game.playerRight.push = 1;
        } else if (game.playerSide === "Left" && game.playerLeft.push === 0) {
          game.playerLeft.push = 1;
        }
        socket.emit("action", { gameId: gameId, action: Action.Push });
      }
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (
      game.status === "Playing" ||
      (game.status === "Waiting" && game.timer === 0)
    ) {
      game.status === "Playing"
        ? (game.status = "Waiting")
        : (game.status = "Playing");
      socket.emit("action", { gameId: gameId, action: Action.Stop });
    }
  }
};

export const pongKeyUp = (
  event: KeyboardEvent,
  game: GameData,
  gameId: string,
  socket: Socket
) => {
  if (game.playerSide === "Left") {
    game.playerLeft.move = Action.Idle;
    socket.emit("action", { gameId: gameId, action: Action.Idle });
  } else {
    game.playerRight.move = Action.Idle;
    socket.emit("action", { gameId: gameId, action: Action.Idle });
  }
};
