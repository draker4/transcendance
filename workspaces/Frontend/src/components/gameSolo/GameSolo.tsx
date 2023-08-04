"use client";
// Import des composants react
import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Import du style
import styles from "@/styles/gameSolo/GameSolo.module.css";

// Import des composants
import Info from "@/components/game/Info";
import { toast } from "react-toastify";
import { MdLogout } from "react-icons/md";

// Import des services
import TrainingService from "@/services/Training.service";

// Import GameLogic
import { pongKeyDown, pongKeyUp } from "../../lib/game/eventHandlersSolo";
import { gameLoop } from "@/lib/game/gameLoopSolo";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";

type Props = {
  data: GameData;
};

export default function Pong({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const [gameData, setGameData] = useState<GameData>(data);
  const trainingService = new TrainingService();
  const router = useRouter();

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
      pongKeyDown(event, gameData, setGameData);
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(event, gameData, setGameData);
    }
    // Add key event listeners when the component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Remove key event listeners when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameData]);

  async function quitTraining() {
    const ret = await trainingService.quitTraining(gameData.id);
    await toast.promise(new Promise((resolve) => resolve(ret)), {
      pending: "Leaving training...",
      success: "You have left this training",
      error: "Error leaving training",
    });
    router.push("/home");
  }

  return (
    <div className={styles.gameSolo}>
      <div className={styles.pong}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        />
      </div>
      <Info gameData={gameData} setGameData={setGameData} />
      <button onClick={quitTraining} className={styles.quitBtn}>
        <MdLogout />
        <p className={styles.btnTitle}>Leave</p>
      </button>
    </div>
  );
}
