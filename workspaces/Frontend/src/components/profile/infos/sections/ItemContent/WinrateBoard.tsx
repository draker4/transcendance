import styles from "@/styles/profile/ItemContent.module.css";

type Props = {
    winData:{gameWon:number, gameLost:number}
}

export default function WinrateBoard({winData}:Props) {

  const items: {title: string, nb:string, class:string, percent:boolean}[] = [
    {
        title: "wins",
        nb: winData.gameWon.toString(),
        class: `${styles.wins}`,
        percent: false,
    },

    {
        title: "loses",
        nb: winData.gameLost.toString(),
        class: `${styles.loses}`,
        percent: false,
    },

    {
        title: "played",
        nb: (winData.gameWon + winData.gameLost).toString(),
        class: `${styles.played}`,
        percent: false,
    },

    {
        title: "winrate",
        nb: ((winData.gameWon / (winData.gameWon + winData.gameLost)) * 100).toFixed(1),
        class: `${styles.winrate}`,
        percent: true,
    },


  ];


  return (
    <div className={styles.winrateBoard}>
       {
        items.map((item, index) => {
            return (
                <div key={index} className={`${styles.winrateBoardItem} ${item.class}`}>
                    <div className={styles.number}>
                        {item.nb}
                        {item.percent && <div className={styles.percentSign}>%</div>}
                    </div>
                    <div className={styles.title}>{item.title}</div>
                </div>
            );
        })
       }
    </div>
  )
}
