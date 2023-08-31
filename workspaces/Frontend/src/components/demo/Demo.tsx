"use client";

// Import des composants react
import { useEffect, useState } from "react";

// Import du style
import styles from "@/styles/game/Game.module.css";

// Import des composants
import { GameData } from "@transcendence/shared/types/Game.types";
import {
  initPlayerDemo,
  initPong,
  initScoreDemo,
} from "@transcendence/shared/game/initPong";
import PongDemo from "./PongDemo";
import { CircularProgress } from "@mui/material";
import { defineTimer } from "@transcendence/shared/game/pongUtils";
import {
  AI_DEMO,
  AI_ID,
  TIMER_START,
} from "@transcendence/shared/constants/Game.constants";

type Props = {
  profile: Profile;
  demoData: CreateDemo;
  setShowDemo: Function;
};

export default function Demo({ profile, demoData, setShowDemo }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData>();

  //------------------------------------Chargement------------------------------------//

  useEffect(() => {
    const demo: GameData = initPong({
      id: "Demo",
      name: demoData.name,
      type: demoData.type,
      mode: "Training",
      hostSide: demoData.side,
      actualRound: 0,
      maxPoint: demoData.maxPoint,
      maxRound: demoData.maxRound,
      difficulty: demoData.difficulty,
      push: demoData.push,
      pause: demoData.pause,
      background: demoData.background,
      ball: demoData.ball,
      score: initScoreDemo(),
    });
    demo.playerLeft = initPlayerDemo(
      demoData.side === "Left" ? AI_ID : AI_DEMO,
      "Left",
      demoData.side === "Left"
        ? `Coach ${demoData.type}`
        : `Futur ${profile.login}`
    );
    demo.playerRight = initPlayerDemo(
      demoData.side === "Right" ? AI_ID : AI_DEMO,
      "Right",
      demoData.side === "Right"
        ? `Coach ${demoData.type}`
        : `Futur ${profile.login}`
    );
    demo.status = "Playing";
    demo.timer = defineTimer(TIMER_START, "Start");
    demo.demo = true;
    setGameData(demo);
    setIsLoading(false);
  }, []);

  //------------------------------------RENDU------------------------------------//
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <CircularProgress />
      </div>
    );
  }

  if (!isLoading && gameData) {
    return (
      <div className={styles.demo}>
        <PongDemo
          gameData={gameData}
          setGameData={setGameData}
          setShowDemo={setShowDemo}
        />
      </div>
    );
  }
}
