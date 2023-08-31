"use client";

// Import du style
import styles from "@/styles/gameSolo/PongHeadSolo.module.css";

// Import GameLogic
import { GameData } from "@transcendence/shared/types/Game.types";
import { MdClose } from "react-icons/md";

type Props = {
  gameData: GameData;
  setShowDemo: Function;
};

export default function PongDemoHead({ gameData, setShowDemo }: Props) {
  return (
    <div className={styles.pongHead}>
      <div className={styles.leftBlock}></div>
      <h2 className={styles.title}>{gameData.name}</h2>
      <button onClick={() => setShowDemo(false)} className={styles.quitBtn}>
        <MdClose />
      </button>
    </div>
  );
}
