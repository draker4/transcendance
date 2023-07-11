import { Socket } from "socket.io-client";
import { useState } from "react";
import React from "react";
import Search from "./Search";

export default function SearchAll({ socket, verifyChannel, openDisplay, placeHolder }: {
	socket: Socket;
	verifyChannel: (text: string) => ListError;
	openDisplay: (display: Display) => void;
	placeHolder: string;
}) {
	const	[channels, setChannels] = useState<Channel []>([]);
	const	[pongies, setPongies] = useState<Pongie []>([]);
	const	[list, setList] = useState<(Channel | Pongie | CreateOne) []>([]);
	const	[error, setError] = useState<ListError | null>(null);

	const	handleBlur = () => {
		console.log("blurrr");
		setList([]);
		setError(null);
	}

	const	handleClick = (item: Display) => {
		openDisplay(item);
	}

	const	getData = (event: React.MouseEvent<HTMLInputElement>) => {
		socket.emit('getAllChannels', (channels: Channel[]) => {
				setChannels(channels);
		});
		socket.emit('getAllPongies', (pongies: Pongie[]) => {
				setPongies(pongies);
		});

		createList(event.currentTarget.value);
	}

	const	createList = (text: string) => {
		let		hasChannel: boolean = false;
		
		if (!text) {
			setList([]);
			setError(null);
			return ;
		}

		const	textlowerCase: string = text.toLocaleLowerCase();
		
		let		list: (Channel | Pongie | CreateOne)[] = [];
		list = list.concat(
			channels.filter(channel => channel?.name.toLowerCase().includes(textlowerCase))
		);

		if (list.length !== 0)
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
				type: "channel",
			}
			list = list.concat(addChannel);
		}

		setList(list);
	}

	return <Search
				list={list}
				error={error}
				getData={getData}
				createList={createList}
				handleBlur={handleBlur}
				handleClick={handleClick}
				placeHolder={placeHolder}
			/>
}
