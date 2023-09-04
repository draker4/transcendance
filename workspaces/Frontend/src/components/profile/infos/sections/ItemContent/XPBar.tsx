import styles from "@/styles/profile/ItemContent.module.css";
import { UserLevel } from "@transcendence/shared/types/Stats.types";

type Props = {
  userLevel:UserLevel;
}

export default function XPBar({userLevel}:Props) {

  const ratio = ((userLevel.userXp * 100) / (userLevel.nextLevelXP + userLevel.userXp)).toFixed(0);

  return (
    <div className={`${styles.xpFrame} ${styles.row}`}>

      <div className={`${styles.xpLevel} ${styles.row}`}>
        {userLevel.level}
      </div>

      <div className={`${styles.xpCapsuleAndXp} ${styles.column}`}>
          <div className={styles.xpCapsule}>
            <div className={`${styles.xpBar}`} style={{width : `${ratio}%`}}>0</div>
          </div>
          <div className={`${styles.xpDigits}`}>{`${userLevel.userXp}  /  ${userLevel.nextLevelXP + userLevel.userXp} xp`}</div>
      </div>
    </div>
  )
}
