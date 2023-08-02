"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/lobby/lobbyList/GameDetails.module.css";

import ScoreService from "@/services/Score.service";
import { ScoreInfo } from "@transcendence/shared/types/Score.types";
import { GameInfo } from "@transcendence/shared/types/Game.types";

type Props = {
  scoreService: ScoreService;
  gameInfo: GameInfo;
};

export default function GameDetails({ scoreService, gameInfo }: Props) {
  const [score, setScore] = useState<ScoreInfo | undefined>(undefined);

  //Recupere le score de la game regulierement
  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await scoreService.getScoreByGameId(gameInfo.id);
        setScore(data);
      } catch (error) {
        setScore(undefined);
        console.log("Error fetching score: " + error);
      }
    };

    // Fetch game list initially
    getScore();

    // Then fetch it every 10 seconds
    const interval = setInterval(getScore, 10000);

    return () => clearInterval(interval);
  }, []);

  function displayRound(round: Round, index: number) {
    return (
      <div key={index} className={styles.displayRound}>
        <p className={styles.round}>{`R${index + 1}: `}</p>
        <p className={styles.score}>{`${round.left} / ${round.right}`}</p>
      </div>
    );
  }

  if (!score)
    return (
      <div className={styles.PartyDetails}>
        <div> Loading...</div>
      </div>
    );

  return (
    <div className={styles.showScore}>
      {score.round
        .slice(0, gameInfo.maxRound)
        .map((round, index) => displayRound(round, index))}
    </div>
  );
}
