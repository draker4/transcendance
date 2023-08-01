// PartyList.tsx
import { useEffect, useState } from "react";
import styles from "@/styles/lobby/party/partyList/PartyList.module.css";

import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import PartyInfo from "./PartyInfo";
import ScoreService from "@/services/Score.service";

type Props = {
  lobbyService: LobbyService;
};

export default function PartyList({ lobbyService }: Props) {
  const scoreService = new ScoreService();
  const [gameList, setGameList] = useState<GameInfo[] | undefined>(undefined);

  //Recupere la liste des games regulierement
  useEffect(() => {
    // Function to fetch the game list
    const getList = async () => {
      try {
        const ret = await lobbyService.getGameList();
        setGameList(ret.data);
        console.log("partyList Updated: ", ret.data);
      } catch (error) {
        console.error("Error fetching game list:", error);
      }
    };

    // Fetch game list initially
    getList();

    // Then fetch it every 10 seconds
    const interval = setInterval(getList, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!gameList) {
    return (
      <div className={styles.partyList}>
        There was an issue loading the party list
      </div>
    );
  } else if (gameList.length === 0) {
    return <div className={styles.partyList}>No Party Available</div>;
  }

  return (
    <div className={styles.partyList}>
      <h2>Party List</h2>
      <div className={styles.list}>
        <div className={styles.listHead}>
          <p className={styles.detailTitle}>Detail</p>
          <p className={styles.nameTitle}>Name</p>
          <p className={styles.typeTitle}>Type</p>
          <p className={styles.playersTitle}>Players</p>
          <p className={styles.roundTitle}>Round</p>
          <p className={styles.statusTitle}>Status</p>
          <p className={styles.actionTitle}>Action</p>
        </div>
        <div className={styles.listBody}>
          {gameList.map((game: GameInfo) => (
            <PartyInfo
              key={game.id}
              lobbyService={lobbyService}
              scoreService={scoreService}
              gameInfo={game}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
