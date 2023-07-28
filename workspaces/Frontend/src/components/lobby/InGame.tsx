"use client";

//Import les composants react
import { MdLogout, MdPlayArrow } from "react-icons/md";

//Import le service pour les games
import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/InGame.module.css";

type Props = {
  lobby: LobbyService;
  gameId: string;
};

export default function InGame({ lobby, gameId }: Props) {
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
