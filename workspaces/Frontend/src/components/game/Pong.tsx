"use client";

// Import des composants react
import { useRef, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

// Import du style
import styles from "@/styles/game/Pong.module.css";

// Import des composants projets
import Info from "@/components/game/Info";

// Import GameLogic
import {
  pongKeyDown,
  pongKeyUp,
  handlePlayerMessage,
  handleStatusMessage,
  handleUpdateMessage,
  handlePing,
  handleScoreMessage,
} from "../../lib/game/eventHandlersMulti";
import { gameLoop } from "@/lib/game/gameLoopMulti";
import { GameData, Draw } from "@transcendence/shared/types/Game.types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
} from "@transcendence/shared/constants/Game.constants";
import PongHead from "../game/PongHead";
import GameService from "@/services/Game.service";
import LobbyService from "@/services/Lobby.service";
import PlayerPreview from "./PlayerPreview";
import GameEnd from "./gameEnd/GameEnd";

type Props = {
  profile: Profile;
  gameData: GameData;
  setGameData: Function;
  socket: Socket;
  isPlayer: "Left" | "Right" | "Spectator";
  gameService: GameService;
  lobby: LobbyService;
};

export default function Pong({
  profile,
  gameData,
  setGameData,
  socket,
  isPlayer,
  gameService,
  lobby,
}: Props) {
  const pongRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMountedRef = useRef(true);
  const animationFrameIdRef = useRef<number | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(true);
  const [showGameEnd, setShowGameEnd] = useState(false);

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
    if (showPreview) return;
    const draw: Draw = {
      canvas: canvasRef.current!,
      context: canvasRef.current!.getContext("2d")!,
      backgroundImage: backgroundImage,
      ballImage: ballImage,
    };
    draw.canvas.focus();

    if (animationFrameIdRef.current === undefined) {
      animationFrameIdRef.current = requestAnimationFrame((timestamp) =>
        gameLoop(timestamp, gameData, draw, isMountedRef)
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      pongKeyDown(event, gameData, socket, profile, isPlayer, isMountedRef);
    }

    function handleKeyUp(event: KeyboardEvent) {
      pongKeyUp(event, gameData, socket, profile, isPlayer, isMountedRef);
    }
    // Add key event listeners when the component mounts
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      isMountedRef.current = false;
      if (animationFrameIdRef.current !== undefined) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = undefined;
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showPreview]);

  useEffect(() => {
    socket.on("player", handlePlayerMessage(setGameData));
    socket.on("status", handleStatusMessage(setGameData));
    socket.on("update", handleUpdateMessage(setGameData));
    socket.on("score", handleScoreMessage(setGameData));

    return () => {
      socket.off("player", handlePlayerMessage(setGameData));
      socket.off("status", handleStatusMessage(setGameData));
      socket.off("update", handleUpdateMessage(setGameData));
      socket.off("score", handleScoreMessage(setGameData));
    };
  }, [socket, setGameData]);

  useEffect(() => {
    socket.on("ping", handlePing(socket, profile.id));

    return () => {
      isMountedRef.current = false;
      socket.off("ping", handlePing(socket, profile.id));
    };
  }, [socket, profile]);

  useEffect(() => {
    switch (gameData.status) {
      case "Not Started":
        setShowPreview(true);
        setShowGameEnd(false);
        break;
      case "Finished":
        setShowPreview(false);
        setShowGameEnd(true);
        break;
      default:
        const timer = setTimeout(() => {
          setShowPreview(false);
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [gameData.status]);

  useEffect(() => {
    pongRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className={styles.pong} ref={pongRef}>
      <PongHead
        profile={profile}
        gameData={gameData}
        gameService={gameService}
        lobby={lobby}
        isPlayer={isPlayer}
      />
      <div className={styles.canvasContainer}>
        {showPreview && <PlayerPreview gameData={gameData} />}
        {!showPreview && (
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
          />
        )}
        {showGameEnd && (
          <GameEnd
            gameData={gameData}
            isPlayer={isPlayer}
            userId={profile.id}
          />
        )}
      </div>
      <Info gameData={gameData} setGameData={setGameData} />
    </div>
  );
}
