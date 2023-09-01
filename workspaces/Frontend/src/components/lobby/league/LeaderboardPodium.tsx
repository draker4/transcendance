import styles from "@/styles/lobby/league/LeaderboardPodium.module.css";

type Props = {};

export default function LeaderboardPodium({}: Props) {
  return (
    <div className={styles.podium}>
      <div className={styles.second}>
        <div className={styles.pad}>
          <p>2</p>
        </div>
      </div>
      <div className={styles.first}>
        <div className={styles.pad}>
          <p>1</p>
        </div>
      </div>
      <div className={styles.third}>
        <div className={styles.pad}>
          <p>3</p>
        </div>
      </div>
    </div>
  );
}
