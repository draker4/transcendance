"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect, useMemo } from "react";
import {
  pongKeyDown,
  pongKeyUp,
  handlePlayerMessage,
  handleStatusMessage,
  handleUpdateMessage,
  handlePing,
} from "../../lib/game/eventHandlers";
import { gameLoop } from "@/lib/game/gameLoop";
import { Socket } from "socket.io-client";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import Info from "./Info";

type Props = {
  userId: number;
  gameData: GameData;
  setGameData: Function;
  socket: Socket;
  isPlayer: "Left" | "Right" | "Spectator";
};

export default function Pong({
  userId,
  gameData,
  setGameData,
  socket,
  isPlayer,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const animationFrameIdRef = useRef<number | undefined>(undefined);

  const backgroundImage = useMemo(() => {
    const image = new Image();
    image.src = `/images/background/${gameData.background}.png`;
    return image;
  }, [gameData.background]);

  const ballImage = useMemo(() => {
    const image = new Image();
    image.src = `/images/ball/${gameData.ballImg}.png`;
    return image;
  }, [gameData.ballImg]);

  useEffect(() => {
    const draw: Draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
      backgroundImage: backgroundImage,
      ballImage: ballImage,
    };
    draw.canvas.focus();

    isMountedRef.current = true;

    if (animationFrameIdRef.current === undefined) {
      animationFrameIdRef.current = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp, gameData, draw, isMountedRef)
      );
    }
    return () => {
      isMountedRef.current = false;
      if (animationFrameIdRef.current !== undefined) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = undefined;
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
    // Add key event listeners when the component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove key event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [socket, userId, isPlayer, gameData]);

  useEffect(() => {
    isMountedRef.current = true;
    socket.on("player", handlePlayerMessage(setGameData, isMountedRef));
    socket.on("status", handleStatusMessage(setGameData, isMountedRef));
    socket.on("update", handleUpdateMessage(setGameData, isMountedRef));

    return () => {
      isMountedRef.current = false;
      socket.off("player", handlePlayerMessage(setGameData, isMountedRef));
      socket.off("status", handleStatusMessage(setGameData, isMountedRef));
      socket.off("update", handleUpdateMessage(setGameData, isMountedRef));
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
      <Info gameData={gameData} setGameData={setGameData} />
    </div>
  );
}
