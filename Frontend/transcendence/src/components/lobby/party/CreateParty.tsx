"use client";

import React, { useState } from "react";
import styles from "@/styles/lobby/party/CreateParty.module.css";

import Lobby_Service from "@/services/Lobby.service";
import DefineType from "@/components/lobby/party/DefineType";
import DefineField from "@/components/lobby/party/DefineField";
import DefineInvite from "@/components/lobby/party/DefineInvite";

type Props = {
	Lobby: Lobby_Service;
	setCreateParty: Function;
};

export default function CreateParty({ Lobby, setCreateParty }: Props) {
	// ------------------------------------  CREATE  ------------------------------------ //
	//Pong Settings
	const [name, setName] = useState<string>("");
	const [push, setPush] = useState<boolean>(false);
	const [score, setScore] = useState<3 | 4 | 5 | 6 | 7 | 8 | 9>(3);
	const [round, setRound] = useState<1 | 3 | 5 | 7 | 9>(3);
	const [side, setSide] = useState<"left" | "right">("left");
	const [background, setBackground] = useState<string>("background/0");
	const [ball, setBall] = useState<string>("ball/0");
	const [type, setType] = useState<string>("classic");
	const [mode, setMode] = useState<string>("perso");

	//Fonction pour rejoindre une game
	const Create_Game = async () => {

		//Creer un objet avec les settings
		const settings: Game_Settings = {
			name: name,
			push: push,
			score: score,
			round: round,
			side: side,
			background: background,
			ball: ball,
			type: type,
			mode: mode,
		};

		//Creer la game
		const res = await Lobby.Create_Game(settings);
	};

	const resetCreate = () => {
		setName("");
		setPush(false);
		setScore(3);
		setRound(1);
		setSide("left");
		setBackground("background/0");
		setBall("ball/0");
		setType("classic");
		setCreateParty(false);
		setMode("perso");
	};

	// -------------------------------------  RENDU  ------------------------------------ //
	return (
		<div className={styles.createParty}>
			<div className={styles.name}>
				<label className={styles.section}>Party Name</label>
				<input
					className={styles.nameInput}
					type="text"
					id="name"
					name="name"
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
			</div>

			<div className={styles.define}>
				<div className={styles.settings}>
					<label className={styles.section}>Define Party Settings</label>
					<DefineType
						push={push}
						setPush={setPush}
						score={score}
						setScore={setScore}
						round={round}
						setRound={setRound}
						type={type}
						setType={setType}
						side={side}
						setSide={setSide}
					/>
				</div>
				<div className={styles.field}>
					<label className={styles.section}>Define Party Field</label>
					<DefineField
						background={background}
						setBackground={setBackground}
						ball={ball}
						setBall={setBall}
					/>
				</div>
			</div>
			<div className={styles.invite}>
				<label className={styles.section}>Invite</label>
				<DefineInvite />
			</div>
			<div className={styles.confirm}>
				<button className={styles.save} type="button" onClick={Create_Game}>
					Create Game
				</button>
				<button className={styles.cancel} type="button" onClick={resetCreate}>
					Cancel
				</button>
			</div>
		</div>
	);
}
