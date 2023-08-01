"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/league/League.module.css";
import Image from "next/image";
import LobbyService from "@/services/Lobby.service";
import MatchmakingService from "@/services/Matchmaking.service";
import DefineType from "@/components/lobby/league/DefineType";
import Leaderboard from "@/components/lobby/league/Leaderboard";
import StreamGame from "@/components/lobby/league/StreamGame";

type Props = {
  matchmakingService: MatchmakingService;
  lobbyService: LobbyService;
};

export default function League({ matchmakingService, lobbyService }: Props) {
  const [json, setJson] = useState<League>({
    Top10: [],
    AllRanked: [],
  } as League);

  //Selection du mode de jeu
  const [type, setType] = useState<string>("classic");

  // -----------------------------------  MATCHMAKE  ---------------------------------- //

  //True si en matchmake
  const [inMatchMaking, setinMatchMake] = useState(false);

  //Fonction pour rejoindre une game
  const Start_Matchmake = async () => {
    //Lance la recherche de game
    const res = await matchmakingService.Start_Matchmaking(type);
    setinMatchMake(res);
  };

  //Fonction pour commencer la recherche une game
  const Stop_Matchmake = async () => {
    await matchmakingService.Stop_Matchmaking();
    setinMatchMake(false);
  };

  //Recupere les games et les players pour les afficher
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       Lobby.GetLeague().then((json) => {
  //         setJson(json);
  //       });
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, [Lobby]);

  // -------------------------------------  RENDU  ------------------------------------ //

  return (
    <div className={styles.league}>
      {!inMatchMaking && <DefineType type={type} setType={setType} />}
      {!inMatchMaking && (
        <button className={styles.searchBtn} onClick={Start_Matchmake}>
          <p>Start Search</p>
        </button>
      )}

      {inMatchMaking && (
        <Image
          src={`/images/lobby/balls.gif`}
          alt="Searching giff"
          width="120"
          height="120"
        />
      )}
      {inMatchMaking && (
        <button className={styles.searchBtn} onClick={Stop_Matchmake}>
          <p>Stop Search</p>
        </button>
      )}

      <Leaderboard json={json.Top10} />
      <StreamGame lobbyService={lobbyService} json={json.AllRanked} />
    </div>
  );
}
