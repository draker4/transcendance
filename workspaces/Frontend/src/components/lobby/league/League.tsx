"use client";

import styles from "@/styles/lobby/league/League.module.css";
import LobbyService from "@/services/Lobby.service";

import Searching from "@/components/lobby/league/Searching";
import PartyList from "@/components/lobby/lobbyList/LobbyList";
import LeaderboardList from "@/components/lobby/league/leaderboardList/LeaderboardList";
import LeaderboardPodium from "@/components/lobby/league//LeaderboardPodium";

export default function League() {
  const lobbyService = new LobbyService();

  return (
    <div className={styles.league}>
      <div className={styles.displayLeague}>
        <div className={styles.resume}>
          <Searching />
          <LeaderboardPodium />
        </div>
        <LeaderboardList lobbyService={lobbyService} mode={"League"} />
      </div>
      <PartyList lobbyService={lobbyService} mode={"League"} />
    </div>
  );
}
