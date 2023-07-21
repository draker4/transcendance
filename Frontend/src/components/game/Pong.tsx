"use client";
import styles from "@/styles/game/Pong.module.css";
import { useRef, useEffect } from "react";
import { pongKeyDown, pongKeyUp } from "@/lib/game/eventHandlers";
import { initGame } from "@Shared/game/class/Pong";
import { gameLoop } from "@/lib/game/gameLoop";
import { Socket } from "socket.io-client";
import { GameData, Draw } from "@Shared/types/Game.types";

type Props = {
  gameData: GameSettings;
  socket: Socket;
};

export default function Pong({ gameData, socket }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
    };
    draw.canvas.focus();
    // const game = initGame();
    // socket?.emit("join", gameData.uuid, (data: any) => {
    //   console.log(data);
    // });

    // const handleKeyDown = (event: KeyboardEvent) => {
    //   pongKeyDown(event, game, gameData.uuid, socket);
    // };

    // const handleKeyUp = (event: KeyboardEvent) => {
    //   pongKeyUp(event, game, gameData.uuid, socket);
    // };

    // requestAnimationFrame((timestamp) => gameLoop(timestamp, game, draw));
    // document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener("keyup", handleKeyUp);
    // socket.on("update", (data: any) => {
    //   console.log(data);
    // });
    // socket.on("status", () => getData());

    // return () => {
    //   document.removeEventListener("keydown", handleKeyDown);
    //   document.removeEventListener("keyup", handleKeyUp);
    //   socket.off("update");
    //   // socket.off("status");
    // };
  }, [socket, gameData]);

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
