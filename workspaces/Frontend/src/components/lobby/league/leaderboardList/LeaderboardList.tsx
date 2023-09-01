"use client";

// PartyList.tsx
import { useEffect, useState } from "react";
import styles from "@/styles/lobby/league/leaderboardList/LeaderboardList.module.css";

import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import GameLine from "./GameLine";
import ScoreService from "@/services/Score.service";

type Props = {
  lobbyService: LobbyService;
  mode?: "League" | "Party";
};

export default function LeaderboardList({ lobbyService, mode }: Props) {
  const scoreService = new ScoreService();
  const [gameList, setGameList] = useState<GameInfo[] | undefined>(undefined);

  useEffect(() => {
    const getList = async () => {
      try {
        const ret = await lobbyService.getCurrentGame(mode);
        setGameList(ret.data);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };

    getList();

    const interval = setInterval(getList, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.partyList}>
      <h2 className={styles.listTitle}>Leaderboard</h2>
      <div className={styles.list}>
        <div className={styles.listHead}>
          <p className={styles.nameTitle}>Name</p>
          <p className={styles.typeTitle}>Type</p>
          <p className={styles.playersTitle}>Players</p>
          <p className={styles.roundTitle}>Round</p>
          <p className={styles.statusTitle}>Status</p>
          <p className={styles.actionTitle}>Action</p>
        </div>
        {!gameList && <p className={styles.loading}>Loading...</p>}
        {gameList && gameList.length === 0 && (
          <p className={styles.noGames}>No games being played</p>
        )}
        {gameList && gameList.length > 0 && (
          <div className={styles.listBody}>
            {gameList.map((game: GameInfo) => (
              <GameLine
                key={game.id}
                lobbyService={lobbyService}
                scoreService={scoreService}
                gameInfo={game}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}