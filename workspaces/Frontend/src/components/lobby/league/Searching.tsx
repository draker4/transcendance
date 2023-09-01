import React, { useState, useEffect } from "react";

import DefineType from "@/components/lobby/league/DefineType";
import styles from "@/styles/lobby/league/Searching.module.css";

import MatchmakingService from "@/services/Matchmaking.service";
import { CircularProgress } from "@mui/material";

export default function Searching() {
  const matchmakingService = new MatchmakingService();
  const [type, setType] = useState<string>("classic");
  const [inMatchMaking, setinMatchMake] = useState(false);

  const startMatchmake = async () => {
    const res = await matchmakingService.startMatchmaking(type);
    setinMatchMake(res);
  };

  const stopMatchmake = async () => {
    await matchmakingService.stopMatchmaking();
    setinMatchMake(false);
  };

  // useEffect with a cleanup function to stop matchmaking when the component unmounts
  useEffect(() => {
    return () => {
      stopMatchmake(); // Call stopMatchmake when the component unmounts
    };
  }, []);

  return (
    <div className={styles.searching}>
      {!inMatchMaking && <DefineType type={type} setType={setType} />}
      {inMatchMaking && (
        <div className={styles.searchingOngoing}>
          <CircularProgress />
          <h3 className={styles.section}>Searching...</h3>
        </div>
      )}
      {!inMatchMaking && (
        <button className={styles.searchBtn} onClick={startMatchmake}>
          <p>Start Search</p>
        </button>
      )}
      {inMatchMaking && (
        <button className={styles.searchBtn} onClick={stopMatchmake}>
          <p>Stop Search</p>
        </button>
      )}
    </div>
  );
}
