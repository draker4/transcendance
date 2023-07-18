"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { initGame, gameLoop } from "@/lib/game/handleGame";

type Props = {
  gameInfos: GameSettings;
  AI: boolean;
};

export default function Pong({ gameInfos, AI }: Props) {
  console.log(gameInfos);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasRef.current!.focus();
    const game = initGame(canvasRef.current!, gameInfos, AI);

    console.log(game);

    const handleKeyDown = (event: KeyboardEvent) => {
      pongKeyDown(event, game);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pongKeyUp(event, game);
    };

    requestAnimationFrame((timestamp) => gameLoop(timestamp, game));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameInfos, AI]);

  return (
    <div className={styles.pong}>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1000}
          height={600}
        />
      </div>
    </div>
  );
}
