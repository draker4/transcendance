"use client";

//Import les composants react
import { useState } from "react";
import { MdLogout, MdPlayArrow } from "react-icons/md";

//Import le service pour les games
import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/Lobby.module.css";
import League from "@/components/lobby/league/League";
import Party from "@/components/lobby/party/Party";
import Training from "@/components/lobby/training/Training";
import NavLobby from "./NavLobby";
import MatchmakingService from "@/services/Matchmaking.service";

type Props = {
  profile: Profile;
  token: string | undefined;
};

export default function Lobby({ profile, token }: Props) {
  const lobby = new LobbyService(token);
  const matchmaking = new MatchmakingService(token);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameId, setGameId] = useState<string>("");
  const [menu, setMenu] = useState<string>("League");

  lobby
    .isInGame()
    .then((gameId) => {
      setIsLoading(false);
      setGameId(gameId);
    })

    .catch((error) => {
      console.error(error);
      setIsLoading(false);
    });

  const quit = () => {
    lobby.quitGame();
    setGameId("");
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  } else if (gameId) {
    return (
      <div className={styles.isInGame}>
        <h1>You are actually in Game</h1>
        <div className={styles.inGameChoice}>
          <button
            className={styles.resumeBtn}
            onClick={() => lobby.resumeGame(gameId)}
          >
            <MdPlayArrow />
            Join
          </button>
          <button className={styles.quitBtn} onClick={() => lobby.quitGame()}>
            <MdLogout />
            Quit
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.lobby}>
      <NavLobby menu={menu} setMenu={setMenu} />
      <div className={styles.content}>
        {menu == "League" && <League Matchmaking={matchmaking} token={token} />}
        {menu == "Party" && (
          <Party lobby={lobby} token={token} userId={profile.id} />
        )}
        {menu == "Training" && <Training lobby={lobby} />}
      </div>
    </div>
  );
}
