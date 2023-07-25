"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { initGame } from "@Shared/game/class/Pong";
import { gameLoop } from "@/lib/game/gameLoop";
import { Socket } from "socket.io-client";
import {
  GameData,
  Draw,
  Player,
  StatusMessage,
} from "@Shared/types/Game.types";
import { GAME_HEIGHT, GAME_WIDTH } from "@Shared/constants/Game.constants";
import GameInfo from "./GameInfo";

type Props = {
  gameData: GameData;
  setGameData: Function;
  socket: Socket;
};

export default function Pong({ gameData, setGameData, socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw: Draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
    };
    draw.canvas.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      //pongKeyDown(event, game, gameData.uuid, socket);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      //pongKeyUp(event, game, gameData.uuid, socket);
    };

    //requestAnimationFrame((timestamp) => gameLoop(timestamp, game, draw));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    socket?.on("player", (player: Player) => {
      const newGameData = { ...gameData };
      if (player.side === "Left") newGameData.playerLeft = player;
      else newGameData.playerRight = player;
      setGameData(newGameData);
    });
    socket?.on("status", (fullStatus: StatusMessage) => {
      const newGameData = { ...gameData };
      newGameData.status = fullStatus.status;
      newGameData.result = fullStatus.result;
      newGameData.playerLeftDynamic.status = fullStatus.playerLeft;
      newGameData.playerRightDynamic.status = fullStatus.playerRight;
      newGameData.timer = fullStatus.timer;
      setGameData(newGameData);
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      socket.off("player");
      socket.off("status");
    };
  }, [socket, gameData, setGameData]);

  return (
    <div className={styles.pong}>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        />
      </div>
      <GameInfo gameData={gameData}></GameInfo>
    </div>
  );
}
