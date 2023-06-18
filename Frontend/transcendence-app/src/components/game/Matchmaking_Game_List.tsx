"use client"

import React, { use } from "react";
import One_Game from "@/components/game/Matchmaking_Game_Infos"
import styles from "@/styles/game/game_list.module.css"

import GameService from '@/services/Game.service'

import { useEffect, useState } from 'react'

type Props = {
    token: String | undefined;
}

export default function Matchmaking_Game_List({ token }: Props) {
	const Game = new GameService(token);
	const [jsonGame, setJsonGame] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {

		Game.Get_Game_List().then((json) => {
			setJsonGame(json);
		});
		}, 1000);


		return () => clearInterval(interval);
	}, []);

	return (
		<div>
		<h1>Liste de jeux en matchmaking :</h1>
		{jsonGame.map((game: any, index: number) => (
			<div key={index}>
			<p>UUID: {game.uuid}</p>
			<p>Nom: {game.Name}</p>
			<p>Mot de passe: {game.Password}</p>
			<p>Hôte: {game.Host}</p>
			<p>Adversaire: {game.Opponent}</p>
			<p>Liste des spectateurs: {game.Viewers_List}</p>
			<p>Score Hôte: {game.Score_Host}</p>
			<p>Score Adversaire: {game.Score_Opponent}</p>
			<p>Statut: {game.Status}</p>
			<p>Créé le: {game.CreatedAt}</p>
			<p>Vainqueur: {game.Winner}</p>
			<p>Perdant: {game.Loser}</p>
			</div>
		))}
		</div>
	);
}

  