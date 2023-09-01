"use client";

// Import des composants react
import { useEffect, useState } from "react";

// Import du style
import styles from "@/styles/demo/Demo.module.css";

// Import des composants
import { GameData } from "@transcendence/shared/types/Game.types";
import {
  initPlayerDemo,
  initPong,
  initScoreDemo,
} from "@transcendence/shared/game/initPong";
import PongDemo from "./PongDemo";
import { defineTimer } from "@transcendence/shared/game/pongUtils";
import {
  AI_DEMO,
  AI_ID,
  TIMER_START,
} from "@transcendence/shared/constants/Game.constants";
import LoadingComponent from "../loading/Loading";

type Props = {
  login: string;
  demoData: CreateDemo;
  setShowDemo: Function;
  scrollTop: boolean;
};

export default function Demo({ login, demoData, setShowDemo, scrollTop = true }: Props) {
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
      demoData.side === "Left" ? AI_DEMO : AI_ID,
      "Left",
      demoData.side === "Left" ? `Futur ${login}` : `Coach ${demoData.type}`
    );
    demo.playerRight = initPlayerDemo(
      demoData.side === "Right" ? AI_DEMO : AI_ID,
      "Right",
      demoData.side === "Right" ? `Futur ${login}` : `Coach ${demoData.type}`
    );
    demo.status = "Playing";
    demo.timer = defineTimer(1, "Start");
    demo.demo = true;
    setGameData(demo);
    setIsLoading(false);
  }, []);

  //------------------------------------RENDU------------------------------------//
  if (isLoading) {
    return (
      <div className={styles.gameLoading}>
        <LoadingComponent />
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
          scrollTop={scrollTop}
        />
      </div>
    );
  }
}
