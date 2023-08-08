import styles from "@/styles/lobby/league/Leaderboard.module.css";
import Image from "next/image";

type Props = {
	json: PlayerLeaderBoard[];
};

export default function Leaderboard({ json }: Props) {

    if (json === undefined || json === null || json.length === 0) {
        return (
            <div className={styles.leaderboard}>
                <h1>Ranking</h1>
                <p className={styles.loading}>Recherche en cours...</p>
            </div>
        )
    }

    return (

        <div className={styles.leaderboard}>

            <h1>Ranking</h1>

            <div className={styles.podium}>
                <div className={styles.second}>
                    <div className={styles.pad}>
                        <p>2</p>
                    </div>
                    {json.length > 1 && json[1] && (
                        <div >
                            <Image alt="profile image" src={json[1].avatar} className={styles.avatar} width={100} height={100}/>
                            <p>{json[1].login}</p>
                        </div>
                    )}
                </div>
                <div className={styles.first}>
                    <div className={styles.pad}>
                        <p>1</p>
                    </div>
                    {json.length > 0 && json[0] && (
                        <div >
                            <Image alt="profile image" src={json[0].avatar} className={styles.avatar} width={100} height={100}/>
                            <p>{json[0].login}</p>
                        </div>
                    )}
                </div>
                <div className={styles.third}>
                    <div className={styles.pad}>
                        <p>3</p>
                    </div>
                    {json.length > 2 && json[2] && (
                        <div >
                            <Image alt="profile image" src={json[2].avatar} className={styles.avatar} width={100} height={100}/>
                            <p>{json[2].login}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.playerlist}>
                {json.length > 0   && json.map((player: any, index: number) => (
                    <div className={styles.player} key={index}>
                        <div className={styles.avatar_box}>
							<Image alt="profile image" src={player.avatar} className={styles.avatar} width={50} height={50}/>
							<p>{player.login}</p>
						</div>
                        <p>{player.score}</p>
                        <p>{player.rank}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
