import React, { useState, useEffect } from "react";

import DefineType from "@/components/lobby/league/DefineType";
import styles from "@/styles/lobby/league/Searching.module.css";

import MatchmakingService from "@/services/Matchmaking.service";
import { CircularProgress } from "@mui/material";

export default function Searching() {
  const matchmakingService = new MatchmakingService();
  const [type, setType] = useState<string>("Classic");
  const [searching, setSearching] = useState(false);

  const startMatchmake = async () => {
    const res = await matchmakingService.startMatchmaking(type);
    setSearching(res);
  };

  const stopMatchmake = async () => {
    await matchmakingService.stopMatchmaking();
    setSearching(false);
  };

  useEffect(() => {
    return () => {
      stopMatchmake();
    };
  }, []);

  return (
    <div className={styles.searching}>
      {!searching && <DefineType type={type} setType={setType} />}
      {searching && (
        <div className={styles.searchingOngoing}>
          <CircularProgress />
          <h3 className={styles.section}>Searching...</h3>
        </div>
      )}
      {!searching && (
        <button className={styles.searchBtn} onClick={startMatchmake}>
          <p>Start Search</p>
        </button>
      )}
      {searching && (
        <button className={styles.searchBtn} onClick={stopMatchmake}>
          <p>Stop Search</p>
        </button>
      )}
    </div>
  );
}
