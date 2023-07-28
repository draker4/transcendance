"use client";

//Import les composants react
import { useState, useEffect } from "react";

//Import le service pour les games
import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/Lobby.module.css";
import League from "@/components/lobby/league/League";
import Party from "@/components/lobby/party/Party";
import Training from "@/components/lobby/training/Training";
import NavLobby from "./NavLobby";
import MatchmakingService from "@/services/Matchmaking.service";
import InGame from "./InGame";

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

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );
  } else if (gameId) {
    return <InGame lobby={lobby} gameId={gameId} />;
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
