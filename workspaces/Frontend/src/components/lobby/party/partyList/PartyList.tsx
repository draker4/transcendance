// PartyList.tsx
import { useEffect, useState } from "react";
import styles from "@/styles/lobby/party/partyList/PartyList.module.css";

import LobbyService from "@/services/Lobby.service";
import { GameInfo } from "@transcendence/shared/types/Game.types";
import PartyInfo from "./PartyInfo";
import ScoreService from "@/services/Score.service";

type Props = {
  lobbyService: LobbyService;
  token: string | undefined;
};

export default function PartyList({ lobbyService, token }: Props) {
  const scoreService = new ScoreService(token);
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
      <table className={styles.list}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Players</th>
            <th>Details</th>
            <th>Round</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {gameList.map((game: GameInfo) => (
            <PartyInfo
              key={game.id}
              lobbyService={lobbyService}
              scoreService={scoreService}
              gameInfo={game}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
