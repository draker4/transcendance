import styles from "@/styles/profile/ItemContent.module.css";
import WinrateBoard from "./WinrateBoard";

type Props = {
    winData:{gameWon:number, gameLost:number}
}

export default function Winrate({winData}:Props) {

/* [!][+] ITEM DISPLAY_TEST ONLY */
    winData.gameWon = 3128;
    winData.gameLost = 5899;
/* */

const winrateRender = ():JSX.Element => {
    if (winData.gameWon === 0 && winData.gameLost === 0) {
        return (
            <p className={styles.placeholder}>{`It's time to start playing !`}</p>
        )
    } else {
        return <WinrateBoard winData={winData}/>
    }
}

  return (
    <div className={styles.main}>
        <div className={""}>{winrateRender()}</div>
    </div>
  )
}
