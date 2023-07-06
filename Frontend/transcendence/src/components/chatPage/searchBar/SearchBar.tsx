import { Socket } from "socket.io-client";
import React from "react";
import SearchAll from "./SearchAll";
import SearchMyPongies from "./SearchMyPongies";
import SearchMyChannels from "./SearchMyChannels";

export default function SearchBar({ socket, search, openDisplay }: {
	socket: Socket;
	search: "all" | "myPongies" | "myChannels";
	openDisplay: (display: Display) => void;
}) {

	const	verifyPongie = (text: string): ListError => {
		if (text.includes(" "))
			return {
				id: -1,
				error: true,
				msg: "No space in the login please",
			};
		
		return {
			id: -1,
			error: false,
			msg: "",
		};
	}

	const	verifyChannel = (text: string) => {
		if (text.includes("'") || text.includes('"'))
			return {
				id: -1,
				error: true,
				msg: "No quotes in the name please",
			};
		
		return {
			id: -1,
			error: false,
			msg: "",
		};
	}

	if (search === "all")
		return <SearchAll
					socket={socket}
					openDisplay={openDisplay}
					verifyChannel={verifyChannel}
				/>

	if (search === "myPongies")
		return <SearchMyPongies
					socket={socket}
					openDisplay={openDisplay}
					verifyPongie={verifyPongie}
				/>

	if (search === "myChannels")
		return <SearchMyChannels
					socket={socket}
					openDisplay={openDisplay}
					verifyChannel={verifyChannel}
				/>
}
