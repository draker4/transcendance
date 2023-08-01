import { Socket } from "socket.io-client";
import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import { useEffect, useState } from "react";
import SearchBarPongies from "@/components/chatPage/searchBar/SearchBarPongies";

export default function SectionPongies({ socket }: {
	socket: Socket | undefined;
}) {

	const	[pongies, setPongies] = useState<Pongie[]>([]);

	useEffect(() => {

		const	getPongies = (payload: Pongie[]) => {
			console.log(payload);
		}

		socket?.emit('getPongies', getPongies);

	}, [socket]);

	const	displayPongie = (display: Display) => {
		console.log(display);
	}

	return (
		<div className={stylesInfoCard.sections}>
			<SearchBarPongies
				socket={socket as Socket}
				displayPongie={displayPongie}
			/>
			My Pongies
		</div>
	);
}
