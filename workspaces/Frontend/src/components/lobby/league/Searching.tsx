import React, { useState, useEffect } from "react";
import DefineType from "@/components/lobby/league/DefineType";
import styles from "@/styles/lobby/league/Searching.module.css";
import MatchmakingService from "@/services/Matchmaking.service";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Searching() {
  const matchmakingService = new MatchmakingService();
  const [type, setType] = useState<"Classic" | "Best3" | "Best5">("Classic");
  const [searching, setSearching] = useState(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const router = useRouter();

  const startMatchmake = async () => {
    const res = await matchmakingService.startSearch(type);
    if (res.success) {
      setSearching(true);
      checkSearch();
    }
  };

  const checkSearch = async () => {
    const res = await matchmakingService.checkSearch();
    console.log(res);
    if (res.success) {
      setSearching(false);
      if (res.data) router.push(`/home/game/${res.data}`);
    } else {
      const timeoutId = setTimeout(() => {
        checkSearch();
      }, 1000);
      setSearchTimeoutId(timeoutId);
    }
  };

  const stopMatchmake = async () => {
    setSearching(false);
    if (searchTimeoutId !== null) {
      clearTimeout(searchTimeoutId);
    }
    await matchmakingService.stopSearch();
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
