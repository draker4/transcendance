import styles from "@/styles/game/gameEnd/LevelUp.module.css";

type Props = {
  newLevel: number;
  setNewLevel: Function;
};

export default function LevelUp({ newLevel, setNewLevel }: Props) {
  return (
    <div className={styles.levelUp}>
      <h2>Congrats !</h2>
      <h3>{`You Up Level  ${newLevel} !`}</h3>
      <button className={styles.confirmBtn} onClick={() => setNewLevel(0)}>
        Confirm
      </button>
    </div>
  );
}
