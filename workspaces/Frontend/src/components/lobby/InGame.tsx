"use client";

//Import les composants react
import { useRouter } from "next/navigation";
import { MdLogout, MdPlayArrow } from "react-icons/md";

//Import le service pour les games
import LobbyService from "@/services/Lobby.service";
import styles from "@/styles/lobby/InGame.module.css";
import { set } from "react-hook-form";

type Props = {
  lobby: LobbyService;
  gameId: string;
  setGameId: Function;
};

export default function InGame({ lobby, gameId, setGameId }: Props) {
  const router = useRouter();
  function resumeGame(gameId: string) {
    const url = "home/game/" + gameId;
    router.push(url);
  }

  async function quitGame() {
    await lobby.quitGame();
    router.refresh();
    setGameId(undefined);
  }

  return (
    <div className={styles.isInGame}>
      <h1>You are actually in Game</h1>
      <div className={styles.inGameChoice}>
        <button className={styles.resumeBtn} onClick={() => resumeGame(gameId)}>
          <MdPlayArrow />
          Join
        </button>
        <button className={styles.quitBtn} onClick={() => quitGame()}>
          <MdLogout />
          Quit
        </button>
      </div>
    </div>
  );
}
