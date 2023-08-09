"use client";

import React, { useState, useEffect, useMemo} from "react";
import styles from "@/styles/lobby/league/League.module.css";
import LobbyService from "@/services/Lobby.service";
import MatchmakingService from "@/services/Matchmaking.service";

import Searching from "@/components/lobby/league/Searching";
import Leaderboard from "@/components/lobby/league/Leaderboard";
import StreamGame from "@/components/lobby/league/StreamGame";

type Props = {
	Matchmaking: MatchmakingService;
};

export default function League({ Matchmaking }: Props) {

	const lobbyService = new LobbyService();
	const [json, setJson] = useState<League>( {Top10: [], AllRanked: []} as League);

	useEffect(() => {
		const interval = setInterval(() => {
			lobbyService.getLeague().then((Data : League) => { setJson(Data); });
		}, 3000);
		return () => clearInterval(interval);
	}, [lobbyService]);

	return (
		<div className={styles.league}>
			<Searching Matchmaking={Matchmaking}/>
			<Leaderboard json={json.Top10}/>
			<StreamGame Lobby={lobbyService} json={json.AllRanked} />
		</div>
	);
}
