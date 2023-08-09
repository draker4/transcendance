"use client";

import React, { useState, useEffect} from "react";
import styles from "@/styles/lobby/league/League.module.css";
import LobbyService from "@/services/Lobby.service";
import MatchmakingService from "@/services/Matchmaking.service";

import Searching from "@/components/lobby/league/Searching";
import Leaderboard from "@/components/lobby/league/Leaderboard";
import StreamGame from "@/components/lobby/league/StreamGame";
// import { useRouter } from "next/navigation";
// import disconnect from "@/lib/disconnect/disconnect";

type Props = {
	Matchmaking: MatchmakingService;
};

export default function League({ Matchmaking }: Props) {

	const lobbyService = new LobbyService();
	const [json, setJson] = useState<League>( {Top10: [], AllRanked: []} as League);

	useEffect(() => {
		const interval = setInterval(async () => {
			// [!] bperriol: ici getLeague n'était pas dans un try catch
			// try {
				lobbyService.getLeague().then((Data : League) => { setJson(Data); });
			// }
			// catch (error) {
			// 	const	router = useRouter();
			// 	await disconnect();
			// 	router.refresh();
			// }
		}, 1000);
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
