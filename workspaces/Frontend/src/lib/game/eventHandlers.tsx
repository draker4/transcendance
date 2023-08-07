import {
  Action,
  GameData,
  Player,
} from "@transcendence/shared/types/Game.types";

import {
  StatusMessage,
  UpdateData,
} from "@transcendence/shared/types/Message.types";

import { Socket } from "socket.io-client";
import {
  addUpdateMessage,
  addPlayerMessage,
  addStatusMessage,
} from "@/lib/game/gameLoop";

export const pongKeyDown = (
  event: KeyboardEvent,
  game: GameData,
  socket: Socket | null,
  userId: number,
  isPlayer: "Left" | "Right" | "Spectator"
) => {
  if (game.status === "Playing") {
    // handle player move Up
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        move: Action.Up,
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (isPlayer === "Right" && game.playerRightDynamic.move !== "Up") {
        game.playerRightDynamic.move = Action.Up;
        if (socket) {
          socket.emit("action", action);
        }
      } else if (isPlayer === "Left" && game.playerLeftDynamic.move !== "Up") {
        game.playerLeftDynamic.move = Action.Up;
        if (socket) {
          socket.emit("action", action);
        }
      }

      // handle player move Down
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        move: Action.Down,
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (
        isPlayer === "Right" &&
        game.playerRightDynamic.move !== Action.Down
      ) {
        game.playerRightDynamic.move = Action.Down;
        if (socket) {
          socket.emit("action", action);
        }
      } else if (
        isPlayer === "Left" &&
        game.playerLeftDynamic.move !== Action.Down
      ) {
        game.playerLeftDynamic.move = Action.Down;
        if (socket) {
          socket.emit("action", action);
        }
      }

      // handle player push
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        const action: ActionDTO = {
          userId: userId,
          gameId: game.id,
          move: Action.Push,
          playerSide: isPlayer === "Left" ? "Left" : "Right",
        };
        if (isPlayer === "Right" && game.playerRightDynamic.push === 0) {
          game.playerRightDynamic.push = 1;
          if (socket) {
            socket.emit("action", action);
            console.log("Push Right", action);
          }
        } else if (isPlayer === "Left" && game.playerLeftDynamic.push === 0) {
          game.playerLeftDynamic.push = 1;
          if (socket) {
            socket.emit("action", action);
            console.log("Push Left", action);
          }
        }
      }
    }
  }

  // handle player start/stop
  if (event.key === "Enter") {
    event.preventDefault();
    if (game.status === "Stopped" || game.status === "Playing") {
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        move: Action.Stop,
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (
        isPlayer === "Right" &&
        game.playerRightDynamic.move !== Action.Stop
      ) {
        game.playerRightDynamic.move = Action.Stop;
        if (socket) {
          socket.emit("action", action);
          console.log("Start/Stop Right", action);
        }
      } else if (
        isPlayer === "Left" &&
        game.playerLeftDynamic.move !== Action.Stop
      ) {
        game.playerLeftDynamic.move = Action.Stop;
        if (socket) {
          socket.emit("action", action);
          console.log("Start/Stop Left", action);
        }
      }
    }
  }
};

export const pongKeyUp = (
  event: KeyboardEvent,
  game: GameData,
  socket: Socket | null,
  userId: number,
  isPlayer: "Left" | "Right" | "Spectator"
) => {
  const action: ActionDTO = {
    userId: userId,
    gameId: game.id,
    move: Action.Idle,
    playerSide: isPlayer === "Left" ? "Left" : "Right",
  };
  if (isPlayer === "Left" && game.playerLeftDynamic.move !== Action.Idle) {
    game.playerLeftDynamic.move = Action.Idle;
    if (socket) {
      socket.emit("action", action);
    }
  } else if (
    isPlayer === "Right" &&
    game.playerRightDynamic.move !== Action.Idle
  ) {
    game.playerRightDynamic.move = Action.Idle;
    if (socket) {
      socket.emit("action", action);
    }
  }
};

// Handler for "player" event
export const handlePlayerMessage =
  (setGameData: Function, isMountedRef: React.MutableRefObject<boolean>) =>
  (player: Player) => {
    if (!isMountedRef.current) return;
    addPlayerMessage(player);
    setGameData((prevGameData: GameData) => {
      const newGameData = { ...prevGameData };
      if (player.side === "Left") {
        newGameData.playerLeft = player;
      } else if (player.side === "Right") {
        newGameData.playerRight = player;
      }
      return newGameData;
    });
  };

// Handler for "status" event
export const handleStatusMessage =
  (setGameData: Function, isMountedRef: React.MutableRefObject<boolean>) =>
  (fullStatus: StatusMessage) => {
    if (!isMountedRef.current) return;
    addStatusMessage(fullStatus);
    setGameData((prevGameData: GameData) => ({
      ...prevGameData,
      status: fullStatus.status,
      result: fullStatus.result,
      playerLeftStatus: fullStatus.playerLeft,
      playerRightStatus: fullStatus.playerRight,
      timer: fullStatus.timer,
      pause: fullStatus.pause,
    }));
  };

export const handleUpdateMessage =
  (setGameData: Function, isMountedRef: React.MutableRefObject<boolean>) =>
  (updateData: UpdateData) => {
    if (!isMountedRef.current) return;
    addUpdateMessage(updateData);
    setGameData((prevGameData: GameData) => {
      const newGameData = { ...prevGameData };
      newGameData.playerLeftDynamic = updateData.playerLeftDynamic;
      newGameData.playerRightDynamic = updateData.playerRightDynamic;
      newGameData.ball = updateData.ball;
      newGameData.score = updateData.score;
      newGameData.actualRound = updateData.actualRound;
      return newGameData;
    });
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
  };