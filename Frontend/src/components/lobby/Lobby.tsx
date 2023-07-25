"use client";

//Import les composants react
import { useState } from "react";

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
  const Matchmaking = new MatchmakingService(token);

  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState("League");

  lobby
    .IsInGame()
    .then((gameId) => {
      if (gameId) {
        lobby.ResumeGame(gameId);
      }
      setIsLoading(false);
    })

    .catch((error) => {
      console.error(error);
      setIsLoading(false);
    });

  return (
    <div className={styles.lobby}>
      <NavLobby menu={menu} setMenu={setMenu} />
      <div className={styles.content}>
        {menu == "League" && (
          <League
            Matchmaking={Matchmaking}
            isLoading={isLoading}
            token={token}
          />
        )}
        {menu == "Party" && (
          <Party
            lobby={lobby}
            isLoading={isLoading}
            token={token}
            userId={profile.id}
          />
        )}
        {menu == "Training" && <Training lobby={lobby} isLoading={isLoading} />}
      </div>
    </div>
  );
}
