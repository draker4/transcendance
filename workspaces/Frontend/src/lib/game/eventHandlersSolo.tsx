import { Action, GameData } from "@transcendence/shared/types/Game.types";
import { ActionSolo } from "@transcendence/shared/types/Message.types";
import {
  TIMER_RESTART,
  TIMER_PAUSE,
} from "@transcendence/shared/constants/Game.constants";
import { defineTimer } from "@transcendence/shared/game/pongUtils";

let pauseLoopRunning: "Left" | "Right" | null = null;

function pauseLoop(side: "Left" | "Right", gameData: GameData) {
  const actualTime = new Date().getTime();
  if (actualTime >= gameData.timer.end) {
    gameData.status = "Playing";
    gameData.sendStatus = true;
    gameData.timer = defineTimer(
      TIMER_RESTART,
      "ReStart",
      side === "Left" ? gameData.playerLeft.name : gameData.playerRight.name
    );
    gameData.sendStatus = true;
    pauseLoopRunning = null;
  } else {
    console.log("pauseLoop");
    // continue checking every second
    setTimeout(() => {
      pauseLoop(side, gameData);
    }, 1000);
  }
}

function startPauseLoop(side: "Left" | "Right", gameData: GameData) {
  if (!pauseLoopRunning) {
    pauseLoopRunning = side;
    pauseLoop(side, gameData);
  }
}

function stopPauseLoop() {
  pauseLoopRunning = null;
}

export const pongKeyDown = (
  event: KeyboardEvent,
  gameData: GameData,
  isPlayer: "Left" | "Right" | ""
) => {
  if (gameData.status === "Playing") {
    // handle player move Up
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (isPlayer === "Left" && gameData.playerLeftDynamic.move !== "Up") {
        gameData.playerLeftDynamic.move = Action.Up;
      } else if (
        isPlayer === "Right" &&
        gameData.playerRightDynamic.move !== "Up"
      ) {
        gameData.playerRightDynamic.move = Action.Up;
      }

      // handle player move Down
    } else if (event.key === "ArrowDown") {
      const action: ActionSolo = {
        action: Action.Down,
        side: "",
      };
      event.preventDefault();
      if (
        isPlayer === "Left" &&
        gameData.playerLeftDynamic.move !== Action.Down
      ) {
        gameData.playerLeftDynamic.move = Action.Down;
      } else if (
        isPlayer === "Right" &&
        gameData.playerRightDynamic.move !== Action.Down
      ) {
        gameData.playerRightDynamic.move = Action.Down;
      }

      // handle player push
    } else if (event.key === " ") {
      event.preventDefault();
      if (gameData.push) {
        if (isPlayer === "Left" && gameData.playerLeftDynamic.push === 0) {
          gameData.playerLeftDynamic.push = 1;
        } else if (
          isPlayer === "Right" &&
          gameData.playerRightDynamic.push === 0
        ) {
          gameData.playerRightDynamic.push = 1;
        }
      }
    }
  }

  // handle player start/stop
  if (event.key === "Enter") {
    event.preventDefault();
    if (gameData.status === "Playing") {
      // Check if player is allowed to pause
      if (isPlayer === "Left" && gameData.pause.left) {
        gameData.pause.left--;
        gameData.pause.status = "Left";
      } else if (isPlayer === "Right" && gameData.pause.right) {
        gameData.pause.right--;
        gameData.pause.status = "Right";
      } else return;
      // Pause the game
      gameData.status = "Stopped";
      console;
      gameData.timer = defineTimer(
        TIMER_PAUSE,
        "Pause",
        isPlayer === "Left"
          ? gameData.playerLeft.name
          : gameData.playerRight.name
      );
      startPauseLoop(isPlayer === "Left" ? "Left" : "Right", gameData);
    } else if (gameData.status === "Stopped") {
      // Check if player is allowed to restart
      if (isPlayer === "Left" && gameData.pause.status === "Right") {
        return;
      } else if (isPlayer === "Right" && gameData.pause.status === "Left") {
        return;
      }

      // Restart the game
      gameData.status = "Playing";
      gameData.sendStatus = true;
      gameData.timer = defineTimer(
        TIMER_RESTART,
        "ReStart",
        isPlayer === "Left"
          ? gameData.playerLeft.name
          : gameData.playerRight.name
      );
      stopPauseLoop();
    }
  }
};

export const pongKeyUp = (
  gameData: GameData,
  isPlayer: "Left" | "Right" | ""
) => {
  if (isPlayer === "Left" && gameData.playerLeftDynamic.move !== Action.Idle) {
    gameData.playerLeftDynamic.move = Action.Idle;
  } else if (
    isPlayer === "Right" &&
    gameData.playerRightDynamic.move !== Action.Idle
  ) {
    gameData.playerRightDynamic.move = Action.Idle;
  }
};
