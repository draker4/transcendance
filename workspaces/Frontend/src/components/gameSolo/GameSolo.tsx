"use client";
import styles from "@/styles/gameSolo/GameSolo.module.css";
import { useRef, useEffect, useMemo } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { gameLoop } from "@/lib/game/gameLoop";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import Info from "@/components/game/Info";

type Props = {
  profile: Profile;
  gameData: GameData;
};

export default function GameSolo({ profile, gameData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const isPlayer: "Left" | "Right" | "Spectator" =
    gameData.playerLeft?.id === profile.id
      ? "Left"
      : gameData.playerRight?.id === profile.id
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
        gameLoop(timestamp, gameData, draw, isMountedRef)
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
      pongKeyDown(event, gameData, null, profile.id, isPlayer);
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(event, gameData, null, profile.id, isPlayer);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [profile.id, isPlayer, gameData]);

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
      {/* <Info gameData={gameData}></Info> */}
    </div>
  );
}
