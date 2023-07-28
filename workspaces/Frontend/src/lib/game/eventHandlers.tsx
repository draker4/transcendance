import { GameData, Player, StatusMessage } from "@Shared/types/Game.types";

import { Socket } from "socket.io-client";

export const pongKeyDown = (
  event: KeyboardEvent,
  game: GameData,
  socket: Socket,
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
        action: "Up",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (isPlayer === "Right" && game.playerRightDynamic.move !== "Up") {
        game.playerRightDynamic.move = "Up";
        socket.emit("action", action);
        console.log("Up Right", action);
      } else if (isPlayer === "Left" && game.playerLeftDynamic.move !== "Up") {
        game.playerLeftDynamic.move = "Up";
        socket.emit("action", action);
        console.log("Up Left", action);
      }

      // handle player move Down
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        action: "Down",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (isPlayer === "Right" && game.playerRightDynamic.move !== "Down") {
        game.playerRightDynamic.move = "Down";
        socket.emit("action", action);
        console.log("Down Right", action);
      } else if (
        isPlayer === "Left" &&
        game.playerLeftDynamic.move !== "Down"
      ) {
        game.playerLeftDynamic.move = "Down";
        socket.emit("action", action);
        console.log("Down Left", action);
      }

      // handle player push
    } else if (event.key === " ") {
      event.preventDefault();
      if (game.push) {
        const action: ActionDTO = {
          userId: userId,
          gameId: game.id,
          action: "Push",
          playerSide: isPlayer === "Left" ? "Left" : "Right",
        };
        if (isPlayer === "Right" && game.playerRightDynamic.push === 0) {
          game.playerRightDynamic.push = 1;
          socket.emit("action", action);
          console.log("Push Right", action);
        } else if (isPlayer === "Left" && game.playerLeftDynamic.push === 0) {
          game.playerLeftDynamic.push = 1;
          socket.emit("action", action);
          console.log("Push Left", action);
        }
      }
    }
  }

  // handle player start/stop
  if (event.key === "Enter") {
    event.preventDefault();
    if (game.result === "On Going") {
      const action: ActionDTO = {
        userId: userId,
        gameId: game.id,
        action: "Stop",
        playerSide: isPlayer === "Left" ? "Left" : "Right",
      };
      if (isPlayer === "Right" && game.playerRightDynamic.move !== "Stop") {
        game.playerRightDynamic.move = "Stop";
        socket.emit("action", action);
        console.log("Start/Stop Right", action);
      } else if (
        isPlayer === "Left" &&
        game.playerLeftDynamic.move !== "Stop"
      ) {
        game.playerLeftDynamic.move = "Stop";
        socket.emit("action", action);
        console.log("Start/Stop Left", action);
      }
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
  const action: ActionDTO = {
    userId: userId,
    gameId: game.id,
    action: "Idle",
    playerSide: isPlayer === "Left" ? "Left" : "Right",
  };
  if (isPlayer === "Left" && game.playerLeftDynamic.move !== "Idle") {
    game.playerLeftDynamic.move = "Idle";
    socket.emit("action", action);
    console.log("Idle Left", action);
  } else if (isPlayer === "Right" && game.playerRightDynamic.move !== "Idle") {
    game.playerRightDynamic.move = "Idle";
    socket.emit("action", action);
    console.log("Idle Right", action);
  }
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
  };
