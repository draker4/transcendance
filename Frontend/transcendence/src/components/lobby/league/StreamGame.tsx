import styles from "@/styles/lobby/league/StreamGame.module.css";

type Props = {
	Lobby: any;
	json: GameRanked[];
};

export default function StreamGame({ Lobby, json }: Props) {

	return (

		<div className={styles.StreamGame}>

			<div className={styles.gamelist}>
				<h1>Game list</h1>
                {json.length === 0 && (<p className={styles.loading}>Recherche en cours...</p>)}
                {json.length > 0   && json.map((game: any, index: number) => (
                    <div className={styles.game} key={index}>
						<p>{game.uuid}</p>
                        <p>{game.Name}</p>
                        <p>{game.Host}</p>
                        <p>{game.Opponent}</p>
						<p>{game.Viewers_List}</p>
						<p>{game.Score_Host}</p>
						<p>{game.Score_Opponent}</p>
						<p>{game.CreatedAt}</p>
						<p>{game.Mode}</p>
						<button className={styles.watchbutton} onClick={() => Lobby.Load_Page("home/game/" + game.uuid)}>Watch</button>
                    </div>
                ))}
            </div>

		</div>
	)
}
