"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { initGame, gameLoop } from "@/lib/game/handleGame";
import { Socket } from "socket.io-client";

type Props = {
  gameInfos: GameSettings;
  AI: boolean;
  socket: Socket;
};

export default function Pong({ gameInfos, AI, socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    canvasRef.current!.focus();
    const game = initGame(canvasRef.current!, gameInfos, AI);
    socket?.emit("join", gameInfos.uuid, (data: any) => {
      console.log(data);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      pongKeyDown(event, game, gameInfos.uuid, socket);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pongKeyUp(event, game, gameInfos.uuid, socket);
    };

    requestAnimationFrame((timestamp) => gameLoop(timestamp, game));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    socket.on("update", (data: any) => {
      console.log(data);
    });
    // socket.on("status", () => getData());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      socket.off("update");
      // socket.off("status");
    };
  }, [gameInfos, AI, socket]);

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
