import styles from "@/styles/profile/ItemContent.module.css";
import { UserLevel } from "@transcendence/shared/types/Stats.types";

type Props = {
  userLevel: UserLevel;
};

export default function XPBar({ userLevel }: Props) {
  const ratio = userLevel.progress;

  return (
    <div className={`${styles.xpFrame} ${styles.row}`}>
      <div className={`${styles.xpLevel} ${styles.row}`}>{userLevel.level}</div>

      <div className={`${styles.xpCapsuleAndXp} ${styles.column}`}>
        <div className={styles.xpCapsule}>
          <div
            className={`${styles.xpBar}`}
            style={{ width: `${userLevel.progress}%` }}
          >
            0
          </div>
        </div>
        <p>{`${userLevel.progress}% of level completion`}</p>
      </div>
    </div>
  );
}
