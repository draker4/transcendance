import styles from "@/styles/lobby/homeProfile/HomeProfile.module.css";
import StatsService from "@/services/Stats.service";
import { useState, useEffect } from "react";
import { StatsImproved } from "@transcendence/shared/types/Stats.types";
import Rank from "@/components/profile/infos/sections/ItemContent/Rank";
import { UserLeaderboard } from "@transcendence/shared/types/Leaderboard.types";
import LobbyService from "@/services/Lobby.service";
import Winrate from "@/components/profile/infos/sections/ItemContent/Winrate";

type Props = {
  profile: Profile;
};

type MyLeague = {
  rank: number;
  won: number;
  lost: number;
}

export default function GameStats({ profile }: Props) {
  const statsService = new StatsService();
  const lobbyService = new LobbyService();
  const [stats, setStats] = useState<StatsImproved | undefined>(undefined);
  const [myRank, setMyRank] = useState<MyLeague>({rank:0, won:0, lost:0});


  const loadLeaderboard = async () => {
    try {
      const rep:ReturnDataTyped<UserLeaderboard[]> = await lobbyService.getLeaderboard();

      if (rep.success && rep.data) {

        const myBoard:UserLeaderboard | undefined = rep.data.find((userBoard) => userBoard.userId === profile.id);
        if (myBoard !== undefined && myBoard.rank > 0) {
          setMyRank({
            rank: myBoard.rank,
            won: myBoard.win,
            lost: myBoard.lost,
          });
        }

    } else {
      throw new Error(rep.message);
    }
    
    } catch(error:any) {
      console.log(`GameStats => loadLeaderboard error : ${error.message}`)
    }
  }

  useEffect(() => {
    const getStats = async () => {
      try {
        const ret = await statsService.getFullStats(profile.id);
        setStats(ret.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    getStats();
    loadLeaderboard();
    const interval = setInterval(getStats, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <p className={styles.loading}>Stats Loading...</p>;
  }

  return (
    <div className={styles.gameStats}>
      <Rank rank={myRank.rank} />
      <Winrate winData={{
        gameWon: myRank.won,
        gameLost: myRank.lost,
        global: stats.gameWon + stats.gameLost,
      }} />
      {/*
      <div className={styles.total}>
          <div className={`${styles.label}`}>
            {`global games played`}
          </div>
          <div className={`${styles.number}`}>
            {`${stats.gameWon + stats.gameLost}`}
          </div>
       </div>
    */}
    </div>
  );
}
