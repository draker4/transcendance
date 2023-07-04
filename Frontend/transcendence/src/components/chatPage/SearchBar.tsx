import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/searchBar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Chat({ socket }: {
	socket: Socket;
}) {

	const	[channels, setChannels] = useState<Channel []>([]);
	const	[pongies, setPongies] = useState<Pongie []>([]);

	const	getAllConv = () => {
		console.log("click, search all");
		
		socket.emit('getAllChannels', (payload: Channel []) => {
			console.log(payload);
		})
		socket.emit('getAllPongies', (payload: Pongie []) => {
			console.log(payload);
		})
	}

	return (
		<div className={styles.main}>
			<input
				type="text"
				placeholder="Search"
				onClick={getAllConv}
			/>
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				className={styles.icon}
			/>
		</div>
	)
}
