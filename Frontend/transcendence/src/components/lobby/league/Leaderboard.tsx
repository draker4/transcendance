import styles from "@/styles/lobby/league/Leaderboard.module.css";

type Props = {
	json: PlayerLeaderBoard[];
};

export default function Leaderboard({ json }: Props) {

    return (

        <div className={styles.leaderboard}>

            <div className={styles.podium}>
                <h1>Podium</h1>
                {json.length === 0 && (<p className={styles.loading}>Recherche en cours...</p>)}
                <div className={styles.first}>
                    {json.length > 0 && json[0] && (
                        <p>{json[0].login}</p>
                    )}
                </div>
                <div className={styles.second}>
                    {json.length > 1 && json[1] && (
                        <p>{json[1].login}</p>
                    )}
                </div>
                <div className={styles.third}>
                    {json.length > 2 && json[2] && (
                        <p>{json[2].login}</p>
                    )}
                </div>
            </div>

            <div className={styles.playerlist}>
                <h1>Players list</h1>
                {json.length === 0 && (<p className={styles.loading}>Recherche en cours...</p>)}
                {json.length > 0   && json.map((player: any, index: number) => (
                    <div className={styles.player} key={index}>
                        <p>{player.login}</p>
                        <p>{player.score}</p>
                        <p>{player.rank}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}
