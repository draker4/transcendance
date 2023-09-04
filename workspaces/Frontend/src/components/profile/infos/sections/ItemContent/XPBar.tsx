import styles from "@/styles/profile/ItemContent.module.css";

type Props = {
  xpData:{
    xp:number, 
    level:number,
    xpToUp:number,
  }
}

export default function XPBar({xpData}:Props) {

  const ratio = ((xpData.xp * 100) / (xpData.xpToUp + xpData.xp)).toFixed(0);

  return (
    <div className={`${styles.xpFrame} ${styles.row}`}>

      <div className={`${styles.xpLevel} ${styles.row}`}>
        {xpData.level}
      </div>

      <div className={`${styles.xpCapsuleAndXp} ${styles.column}`}>
          <div className={styles.xpCapsule}>
            <div className={`${styles.xpBar}`} style={{width : `${ratio}%`}}>#</div>
          </div>
          <div className={`${styles.xpDigits}`}>{`${xpData.xp}  /  ${xpData.xpToUp + xpData.xp} xp`}</div>
      </div>
    </div>
  )
}
