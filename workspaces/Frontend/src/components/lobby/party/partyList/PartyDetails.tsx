"use client";

import { useEffect, useState } from "react";
import { GameInfo } from "@transcendence/shared/types/Game.types";

import ScoreService from "@/services/Score.service";
import { ScoreInfo } from "@transcendence/shared/types/Score.types";

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
        const ret: ReturnData = await scoreService.getScoreByGameId(
          gameInfo.id
        );
        setScore(ret.data);
        console.log("partyList Updated: ", ret.data);
      } catch (error) {
        setScore(undefined);
        console.error("Error fetching game list:", error);
      }
    };

    // Fetch game list initially
    getScore();

    // Then fetch it every 10 seconds
    const interval = setInterval(getScore, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!score) {
    return <p>loading</p>;
  }
  for (let i = 0; i < gameInfo.maxRound; i++) {
    return <p>{`${score.round[i].left} / ${score.round[i].right}`}</p>;
  }
}
