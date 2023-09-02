import styles from "@/styles/profile/ItemContent.module.css";
import {
  faHippo, IconDefinition, faDragon, faOtter, faKiwiBird, faFishFins, faCow, faSeedling
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  rank:number;
}

export default function Rank({rank}:Props) {

  const getIcon = ():IconDefinition => {
    if (!rank || rank <= 0)
      return faSeedling;
    if (rank === 1)
      return faDragon;
    else if (rank === 2)
      return faOtter;
    else if (rank === 3)
      return faKiwiBird;
    else if (rank < 6)
      return faFishFins;
    else if (rank < 12)
      return faHippo;
    else
      return faCow;
  }

  return (
    <div className={styles.main}>

      <div className={styles.rankLetters}>RANK</div>

      <div className={styles.rankBox}>
        <div className={styles.rankMedal}>
          <FontAwesomeIcon icon={getIcon()}/>
        </div>
        <div className={styles.rankNumber} style={{fontSize: (!rank || rank <= 0) ? "1.5rem" : ""}}>
          {(!rank || rank <= 0) ? "unranked" : rank}
        </div>
      </div>

  </div>
  )
}