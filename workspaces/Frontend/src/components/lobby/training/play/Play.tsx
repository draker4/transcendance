"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect, useMemo } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { gameLoop } from "@/lib/game/gameLoop";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import PlayInfo from "./PlayInfo";

type Props = {
  userId: number;
  gameData: GameData;
  setGameData: Function;
};

export default function Play({ userId, gameData, setGameData }: Props) {
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
    image.src = `/images/background/${gameData.background}.png`;
    return image;
  }, [gameData.background]);

  const ballImage = useMemo(() => {
    const image = new Image();
    image.src = `/images/ball/${gameData.ballImg}.png`;
    return image;
  }, [gameData.ballImg]);

  useEffect(() => {
    isMountedRef.current = true;
    let animationFrameId: number | undefined;
    const draw: Draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
      backgroundImage: backgroundImage,
      ballImage: ballImage,
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
      pongKeyDown(event, gameData, null, userId, isPlayer);
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(event, gameData, null, userId, isPlayer);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [userId, isPlayer, gameData]);

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
      <PlayInfo gameData={gameData}></PlayInfo>
    </div>
  );
}
