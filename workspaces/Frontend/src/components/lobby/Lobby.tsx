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
  avatar: Avatar;
};

export default function Lobby({ profile, avatar }: Props) {
  const lobbyService = new LobbyService();
  const matchmakingService = new MatchmakingService();
  const [menu, setMenu] = useState<string>("League");

  return (
	<div className={styles.lobby}>
		<NavLobby menu={menu} setMenu={setMenu} />
		<div className={styles.content}>
			{menu == "League" && (<League Matchmaking={matchmakingService} Lobby={lobbyService}/>)}
			{menu == "Party" && (<Party lobbyService={lobbyService} profile={profile} />)}
			{menu == "Training" && <Training profile={profile} />}
		</div>
	</div>
);
}
