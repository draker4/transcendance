"use client";

import styles from "@/styles/lobby/league/League.module.css";

import { useEffect, useState } from "react";
import LobbyService from "@/services/Lobby.service";

import Searching from "@/components/lobby/league/Searching";
import LobbyList from "@/components/lobby/lobbyList/LobbyList";
import LeaderboardList from "@/components/lobby/league/leaderboardList/LeaderboardList";
import LeaderboardPodium from "@/components/lobby/league//LeaderboardPodium";
import { UserLeaderboard } from "@transcendence/shared/types/Leaderboard.types";

export default function League() {
  const lobbyService = new LobbyService();
  const [leaderboardData, setLeadeboardData] = useState<
    UserLeaderboard[] | undefined
  >(undefined);
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const ret = await lobbyService.getLeaderboard();
        setLeadeboardData(ret.data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
    };

    // Fetch game list initially
    getLeaderboard();

    const interval = setInterval(getLeaderboard, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.league}>
      <div className={styles.displayLeague}>
        <div className={styles.resume}>
          <Searching />
          <LeaderboardPodium leaderboardData={leaderboardData} />
        </div>
        <LeaderboardList leaderboardData={leaderboardData} />
      </div>
      <LobbyList lobbyService={lobbyService} mode={"League"} />
    </div>
  );
}
