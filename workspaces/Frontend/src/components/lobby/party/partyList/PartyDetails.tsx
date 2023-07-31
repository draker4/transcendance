"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/lobby/party/partyList/PartyDetails.module.css";

import ScoreService from "@/services/Score.service";
import { ScoreInfo } from "@transcendence/shared/types/Score.types";
import { GameInfo } from "@transcendence/shared/types/Game.types";

type Props = {
  scoreService: ScoreService;
  gameInfo: GameInfo;
};

export default function PartyDetails({ scoreService, gameInfo }: Props) {
  const [score, setScore] = useState<ScoreInfo | undefined>(undefined);

  //Recupere le score de la game regulierement
  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await scoreService.getScoreByGameId(gameInfo.id);
        setScore(data);
        console.log("score Details: ", data);
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

  function getScore() {
    let scoreString: string = "";
    if (!score) return (scoreString = "Loading...");
    for (let i: number = 0; i < gameInfo.maxRound; i++) {
      if (scoreString) scoreString += " | ";
      scoreString += `R${i + 1}: ${score.round[i].left} - ${
        score.round[i].right
      }   `;
    }
    return scoreString;
  }

  return <tr className={styles.PartyDetails}>{getScore()}</tr>;
}
