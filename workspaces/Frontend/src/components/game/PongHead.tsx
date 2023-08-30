"use client";

// Import du style
import styles from "@/styles/game/PongHead.module.css";

// Import GameLogic
import { GameData } from "@transcendence/shared/types/Game.types";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import GameService from "@/services/Game.service";
import LobbyService from "@/services/Lobby.service";
import { useState } from "react";

type Props = {
  gameData: GameData;
  gameService: GameService;
  lobby: LobbyService;
  isPlayer: "Left" | "Right" | "Spectator";
};

export default function PongHead({
  gameData,
  gameService,
  lobby,
  isPlayer,
}: Props) {
  const router = useRouter();
  const [quitStatus, setQuitStatus] = useState<boolean>(false);

  async function quit() {
    if (quitStatus) return;
    setQuitStatus(true);
    if (isPlayer === "Spectator") {
      console.log("Quit Spectator");
      router.push("/home");
      return;
    }
    const res = await lobby.quitGame().then(() => {
      gameService.socket?.emit("quit");
      router.push("/home");
    });
    await toast.promise(new Promise((resolve) => resolve(res)), {
      pending: "Leaving game...",
      success: "You have left the game",
      error: "Error leaving game",
    });
  }

  return (
    <div className={styles.pongHead}>
      <div className={styles.leftBlock}></div>
      <h2 className={styles.title}>{gameData.name}</h2>
      <button onClick={quit} className={styles.quitBtn}>
        <MdClose />
      </button>
    </div>
  );
}
