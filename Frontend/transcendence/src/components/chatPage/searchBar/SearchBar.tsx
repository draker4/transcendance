import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import Search from "./Search";

export default function SearchBar({ socket, openDisplay }: {
	socket: Socket;
	openDisplay: (display: Display) => void;
}) {
	const	[channels, setChannels] = useState<Channel []>([]);
	const	[pongies, setPongies] = useState<Pongie []>([]);
	const	[list, setList] = useState<(Channel | Pongie | CreateOne) []>([]);
	const	[error, setError] = useState<ListError | null>(null);
	const	[text, setText] = useState<string>("");

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

	const	getData = (event: React.MouseEvent<HTMLInputElement>) => {
		socket.emit('getAllChannels', (channels: Channel[]) => {
			setChannels(channels);
		});
		socket.emit('getAllPongies', (pongies: Pongie[]) => {
			setPongies(pongies);
		});

		setText(event.currentTarget.value);
	}

	useEffect(() => {
		const	createList = (text: string) => {
			let	hasChannel: boolean = false;
			setError(null);
			
			if (!text) {
				setList([]);
				return ;
			}
	
			const	textlowerCase: string = text.toLocaleLowerCase();
	
			let		list: (Channel | Pongie | CreateOne)[] = [];
			list = list.concat(
				channels.filter(channel => channel?.name.toLowerCase().includes(textlowerCase))
			);
	
			if (channels.find(channel => channel?.name.toLowerCase() === text.toLowerCase()))
				hasChannel = true;
	
			list = list.concat(
				pongies.filter(pongie => pongie?.login.toLowerCase().includes(textlowerCase))
			);
	
			if (list.length === 0) {
				const	err: ListError = verifyChannel(text);
	
				if (err.error) {
					setList([]);
					setError(err);
					return ;
				}
			}
	
			if (!hasChannel) {
				const	addChannel: CreateOne = {
					id: -1,
					avatar: {
						name: "",
						image: "",
						variant: "rounded",
						borderColor: "#22d3ee",
						backgroundColor: "#22d3ee",
						text: text,
						empty: true,
						isChannel: true,
						decrypt: false,
					},
					name: "Create channel " + text,
				}
				list = list.concat(addChannel);
			}
	
			setList(list);
		}

		createList(text);
	}, [channels, pongies, text]);

	return <Search
				list={list}
				error={error}
				getData={getData}
				setText={setText}
				openDisplay={openDisplay}
				socket={socket}
				setList={setList}
				setError={setError}
			/>
}
