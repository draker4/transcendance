import { Socket } from "socket.io-client";
import styles from "@/styles/profile/InfoCard.module.css";
import { useEffect, useState } from "react";
import SearchBar from "@/components/chatPage/searchBar/SearchBar";

export default function SectionPongies({ socket }: {
	socket: Socket | undefined;
}) {

	const	[pongies, setPongies] = useState<Pongie[]>([]);

	useEffect(() => {

		const	getPongies = (payload: Pongie[]) => {
			console.log(payload);
		}

		console.log("laaa");
		socket?.emit('getPongies', getPongies);

	}, [socket]);

	const	openProfile = (display: Display) => {
		
	}

	return (
		<div className={styles.sections}>
			<SearchBar socket={socket as Socket} openDisplay={openProfile}/>
			My Pongies
		</div>
	);
}
