import styles from "@/styles/lobby/league/StreamGame.module.css";
import { useState } from "react";
import { MdStar, Md3GMobiledata, Md5G } from "react-icons/md";

import Image from "next/image";

type Props = {
	Lobby: any;
	json: GameRanked[];
};

type Style_Gradient = {
	backgroundImage: string;
}

export default function StreamGame({ Lobby, json }: Props) {

	if (json === undefined || json === null || json.length === 0) {	
		return (
			<div className={styles.StreamGame}>
				<h1>Watch game</h1>
				<p className={styles.loading}>Recherche en cours...</p>
			</div>
		)
	}
	
	const [gameSelected, setGame] = useState<GameRanked>( json[0] as GameRanked);
	const [gradient, setGradient] = useState<Style_Gradient>({ backgroundImage : `-webkit-linear-gradient(-50deg, ${json[0].Color_Host} 50%, ${json[0].Color_Opponent} 50%)` } as Style_Gradient);
	
	const handleHover = (game : GameRanked) => {
		setGame(game);
		setGradient({ backgroundImage : `-webkit-linear-gradient(-50deg, ${game.Color_Host} 50%, ${game.Color_Opponent} 50%)` } as Style_Gradient);
	};

	return (

		<div className={styles.StreamGame}>

			<h1>Watch game</h1>

			<div className={styles.resume} style={gradient}>
				<h1>{gameSelected.Name}</h1>
				<div className={styles.host_box}>
					<Image alt="profile image" src={gameSelected.Avatar_Host} className={styles.avatar_host} width={100} height={100}/>
					<h2 className={styles.host_name}>{gameSelected.Host}</h2>
				</div>
				<div className={styles.opponent_box}>
					<Image alt="profile image" src={gameSelected.Avatar_Opponent} className={styles.avatar_opponent} width={100} height={100}/>
					<h2>{gameSelected.Opponent}</h2>
				</div>
				<button className={styles.watchbutton} onClick={() => Lobby.Load_Page("home/game/" + gameSelected.uuid)}>Watch</button>
			</div>

			<div className={styles.gamelist}>
				<div className={styles.header} >
						<p className={styles.header_name}>Name</p>
						<p className={styles.header_type}>Type</p>
						<p className={styles.header_host}>Host</p>
						<p className={styles.header_vs}>VS</p>
						<p className={styles.header_opponent}>Opponent</p>
                </div>
                {json.map((game: any, index: number) => (
                    <div className={styles.game} key={index} onClick={() => handleHover(game)} >
						<p className={styles.game_name}>{game.Name}</p>
						{game.Mode == "3rounds" && <Md3GMobiledata size={40} />}
						{game.Mode == "5rounds" && <Md5G size={40} />}
						{game.Mode == "classic" && <MdStar size={40} />}
						<div className={styles.avatar_box_1}>
							<p>{game.Host}</p>
							<Image alt="profile image" src={game.Avatar_Host} className={styles.avatar} width={50} height={50}/>
						</div>
						<p className={styles.versus}>VS</p>
						<div className={styles.avatar_box_2}>
							<Image alt="profile image" src={game.Avatar_Opponent} className={styles.avatar} width={50} height={50}/>
							<p>{game.Opponent}</p>
						</div>
                    </div>
                ))}
            </div>

		</div>
	)
}
