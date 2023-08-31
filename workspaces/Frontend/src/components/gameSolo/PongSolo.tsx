"use client";
// Import des composants react
import { useRef, useEffect, useMemo } from "react";

// Import du style
import styles from "@/styles/gameSolo/PongSolo.module.css";

// Import des composants
import Info from "@/components/game/Info";

// Import GameLogic
import { pongKeyDown, pongKeyUp } from "../../lib/game/eventHandlersSolo";
import { gameLoop } from "@/lib/game/gameLoopSolo";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import TrainingService from "@/services/Training.service";
import PongSoloHead from "./PongSoloHead";

type Props = {
  gameData: GameData;
  setGameData: Function;
  isPlayer: "Left" | "Right" | "";
  trainingService: TrainingService;
};

export default function Pong({
  gameData,
  setGameData,
  isPlayer,
  trainingService,
}: Props) {
  const pongRef = useRef<HTMLDivElement>(null);
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
        gameLoop(timestamp, gameData, setGameData, draw, isMountedRef, false)
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
      pongKeyDown(event, gameData, isPlayer === "Left" ? "Left" : "Right");
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(gameData, isPlayer);
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

  // Scroll to the top when gameData changes
  useEffect(() => {
    pongRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={styles.pong} ref={pongRef}>
      <PongSoloHead gameData={gameData} trainingService={trainingService} />
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
