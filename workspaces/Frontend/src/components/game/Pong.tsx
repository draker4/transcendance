"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect, useMemo } from "react";
import {
  pongKeyDown,
  pongKeyUp,
  handlePlayerUpdate,
  handleStatusMessage,
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

import { addToUpdateQueue } from "@/lib/game/gameLoop";

type Props = {
  userId: number;
  gameData: GameData;
  setGameData: Function;
  socket: Socket;
};

export default function Pong({ userId, gameData, setGameData, socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const isPlayer: "Left" | "Right" | "Spectator" =
    gameData.playerLeft?.id === userId
      ? "Left"
      : gameData.playerRight?.id === userId
      ? "Right"
      : "Spectator";

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
    socket.on("player", handlePlayerUpdate(setGameData, isMountedRef));
    socket.on("status", handleStatusMessage(setGameData, isMountedRef));
    socket.on("update", (updatedGameData: GameData) => {
      // Add the received update to the queue
      addToUpdateQueue(updatedGameData);
    });

    return () => {
      isMountedRef.current = false;
      socket.off("player", handlePlayerUpdate(setGameData, isMountedRef));
      socket.off("status", handleStatusMessage(setGameData, isMountedRef));
      socket.off("update", (updatedGameData: GameData) => {
        // Add the received update to the queue
        console.log("update received");
        addToUpdateQueue(updatedGameData);
      });
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
      <Info gameData={gameData} />
    </div>
  );
}
