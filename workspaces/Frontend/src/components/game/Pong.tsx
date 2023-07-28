"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect, useMemo } from "react";
import {
  pongKeyDown,
  pongKeyUp,
  handlePlayerUpdate,
  handleStatusMessage,
  handlePing,
} from "@/lib/game/eventHandlers";
import { gameLoop } from "@/lib/game/gameLoop";
import { Socket } from "socket.io-client";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import GameInfo from "./GameInfo";

type Props = {
  userId: number;
  gameData: GameData;
  setGameData: Function;
  socket: Socket;
};

export default function Pong({ userId, gameData, setGameData, socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const isPlayer: "Left" | "Right" | "Spectator" =
    gameData.playerLeft?.id === userId
      ? "Left"
      : gameData.playerRight?.id === userId
      ? "Right"
      : "Spectator";

  const backgroundImage = useMemo(() => {
    const image = new Image();
    image.src = `/images/game/background/${gameData.background}.png`;
    return image;
  }, [gameData.background]);

  useEffect(() => {
    isMountedRef.current = true;
    let animationFrameId: number | undefined;
    const draw: Draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
      backgroundImage: backgroundImage,
    };
    draw.canvas.focus();

    if (animationFrameId === undefined) {
      animationFrameId = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp, gameData, draw)
      );
    }
    return () => {
      isMountedRef.current = false;
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      pongKeyDown(event, gameData, socket, userId, isPlayer);
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(event, gameData, socket, userId, isPlayer);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [socket, userId, isPlayer, gameData]);

  useEffect(() => {
    isMountedRef.current = true;
    socket.on("player", handlePlayerUpdate(setGameData, isMountedRef));
    socket.on("status", handleStatusMessage(setGameData, isMountedRef));

    return () => {
      isMountedRef.current = false;
      socket.off("player", handlePlayerUpdate(setGameData, isMountedRef));
      socket.off("status", handleStatusMessage(setGameData, isMountedRef));
    };
  }, [socket, setGameData]);

  useEffect(() => {
    isMountedRef.current = true;
    socket.on("ping", handlePing(socket, userId, isMountedRef));

    return () => {
      isMountedRef.current = false;
      socket.off("ping", handlePing(socket, userId, isMountedRef));
    };
  }, [socket, userId]);

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
