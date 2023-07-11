"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/league/League.module.css";
import Image from "next/image";
import DefineType from "@/components/lobby/league/DefineType";
import Leaderboard from "@/components/lobby/league/Leaderboard";
import StreamGame from "@/components/lobby/league/StreamGame";

type Props = {
	Matchmaking: any;
	isLoading: boolean;
};

export default function League({ Matchmaking, isLoading }: Props) {

	//Selection du mode de jeu
	const [type, setType] = useState<string>("classic");

	// -----------------------------------  MATCHMAKE  ---------------------------------- //

	//True si en matchmake
	const [inMatchMaking, setinMatchMake] = useState(false);

	//Fonction pour rejoindre une game
	const Start_Matchmake = async () => {
		//Lance la recherche de game
		const res = await Matchmaking.Start_Matchmaking(type); 
		setinMatchMake(res);
	};

	//Fonction pour commencer la recherche une game
	const Stop_Matchmake = async () => {
		await Matchmaking.Stop_Matchmaking();
		setinMatchMake(false);
	};

	// -------------------------------------  RENDU  ------------------------------------ //
	if (isLoading) {
		return (
			<div className={styles.loading}>
				<h1>Loading...</h1>
			</div>
		);
	}

	if (inMatchMaking) {
		return (
			<div className={styles.league}>
				<Image
					src={`/images/lobby/balls.gif`}
					alt="Searching giff"
					width="120"
					height="120"
				/>
				<button className={styles.searchBtn} onClick={Stop_Matchmake}>
					<p>Stop Search</p>
				</button>
			</div>
		);
	}

	return (
		<div className={styles.league}>
			<DefineType type={type} setType={setType} />
			<button className={styles.searchBtn} onClick={Start_Matchmake}>
				<p>Start Search</p>
			</button>
			<Leaderboard />
			<StreamGame />
		</div>
	);
}
