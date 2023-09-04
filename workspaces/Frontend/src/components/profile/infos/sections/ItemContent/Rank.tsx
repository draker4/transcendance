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
    if (!rank)
      return faSeedling;

    switch (true) {
      case rank <= 0:
        return faSeedling;
      case rank === 1:
        return faDragon;
      case rank === 2:
        return faOtter; 
      case rank === 3:  
        return faKiwiBird;
      case rank < 6:
        return faFishFins;
      case rank < 12:
        return faHippo; 
      default:
        return faCow;
    }
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