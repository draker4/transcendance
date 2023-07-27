import {
  GameData,
  Player,
  StatusMessage,
  Action,
} from "@Shared/types/Game.types";

import { Socket } from "socket.io-client";

export const pongKeyDown = (
  event: KeyboardEvent,
  game: GameData,
  socket: Socket,
  userId: number,
  isPlayer: "Left" | "Right" | "Spectator"
) => {
  if (game.status === "Playing") {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (isPlayer === "Right") {
        game.playerRightDynamic.move = "Up";
      } else if (isPlayer === "Left") {
        game.playerLeftDynamic.move = "Up";
      }
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        action: "Up",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      socket.emit("action", action);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (isPlayer === "Right") {
        game.playerRightDynamic.move = "Down";
      } else if (isPlayer === "Left") {
        game.playerLeftDynamic.move = "Down";
      }
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        action: "Down",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      socket.emit("action", action);
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        if (isPlayer === "Right" && game.playerRightDynamic.push === 0) {
          game.playerRightDynamic.push = 1;
        } else if (isPlayer === "Left" && game.playerLeftDynamic.push === 0) {
          game.playerLeftDynamic.push = 1;
        }
        const action: ActionDTO = {
          userId: userId,
          gameId: game.id,
          action: "Push",
          playerSide: isPlayer === "Left" ? "Left" : "Right",
        };
        socket.emit("action", action);
      }
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (game.result === "On Going") {
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        action: "Stop",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      socket.emit("action", action);
    }
  }
};

export const pongKeyUp = (
  event: KeyboardEvent,
  game: GameData,
  socket: Socket,
  userId: number,
  isPlayer: "Left" | "Right" | "Spectator"
) => {
  if (isPlayer === "Left") {
    game.playerLeftDynamic.move = "Idle";
  } else {
    game.playerRightDynamic.move = "Idle";
  }
  game.playerLeftDynamic.move = "Idle";
  const action: ActionDTO = {
    userId: userId,
    gameId: game.id,
    action: "Idle",
    playerSide: isPlayer === "Left" ? "Left" : "Right",
  };
  socket.emit("action", action);
};

// Handler for "player" event
export const handlePlayerUpdate =
  (setGameData: Function, isMountedRef: React.MutableRefObject<boolean>) =>
  (player: Player) => {
    if (!isMountedRef.current) return;
    setGameData((prevGameData: GameData) => {
      const newGameData = { ...prevGameData };
      if (player.side === "Left") newGameData.playerLeft = player;
      else newGameData.playerRight = player;
      return newGameData;
    });
  };

// Handler for "status" event
export const handleStatusMessage =
  (setGameData: Function, isMountedRef: React.MutableRefObject<boolean>) =>
  (fullStatus: StatusMessage) => {
    if (!isMountedRef.current) return;
    setGameData((prevGameData: GameData) => ({
      ...prevGameData,
      status: fullStatus.status,
      result: fullStatus.result,
      playerLeftStatus: fullStatus.playerLeft,
      playerRightStatus: fullStatus.playerRight,
      timer: fullStatus.timer,
    }));
  };

// Handler for "ping" event
export const handlePing =
  (
    socket: Socket,
    userId: number,
    isMountedRef: React.MutableRefObject<boolean>
  ) =>
  () => {
    if (!isMountedRef.current) return;
    socket.emit("pong", userId);
    console.log(`pingPong user: ${userId} send`);
  };
