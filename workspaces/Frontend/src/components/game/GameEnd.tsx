import { useState, useRef } from "react";
import { GameData } from "@transcendence/shared/types/Game.types";
import styles from "@/styles/game/GameEnd.module.css";
import { useRouter } from "next/navigation";
import LoadingComponent from "../loading/Loading";
import DisplayXP from "./DisplayXP";

type Props = {
  gameData: GameData;
  isPlayer: "Left" | "Right" | "Spectator";
};

export default function GameEnd({ gameData, isPlayer }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function backHome() {
    router.push("/home");
    setLoading(true);
  }

  return (
    <div className={styles.gameEnd}>
      <h2 className={styles.winner}>
        {`${
          gameData.result === "Host" && gameData.hostSide === "Left"
            ? gameData.playerLeft.name
            : gameData.result === "Opponent" && gameData.hostSide === "Right"
            ? gameData.playerLeft.name
            : gameData.playerRight.name
        }
         won the game !`}
      </h2>
      {isPlayer !== "Spectator" && (
        <DisplayXP
          mode={gameData.mode}
          side={isPlayer}
          score={gameData.score}
          nbRound={gameData.actualRound}
          maxPoint={gameData.maxPoint}
        />
      )}
      <button className={styles.homeBtn} onClick={backHome} disabled={loading}>
        {!loading && "Back Home"}
        {loading && <LoadingComponent />}
      </button>
    </div>
  );
}
