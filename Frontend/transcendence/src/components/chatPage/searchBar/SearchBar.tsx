import { Socket } from "socket.io-client";
import { useState } from "react";
import React from "react";
import Search from "./Search";

type CreateOne = {
	id: number,
	avatar: Avatar,
	name: string,
}

export default function SearchBar({ socket, search, openDisplay }: {
	socket: Socket;
	search: "all" | "myPongies" | "myChannels";
	openDisplay: (display: Display) => void;
}) {
	const	[channels, setChannels] = useState<Channel []>([]);
	const	[pongies, setPongies] = useState<Pongie []>([]);
	const	[list, setList] = useState<(Channel | Pongie | CreateOne) []>([]);
	const	[error, setError] = useState<ListError | null>(null);

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

	const	handleBlur = () => {
		setList([]);
		setError(null);
	}

	if (search === "all") {

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
					openDisplay={openDisplay}
				/>
	}

	if (search === "myPongies") {

		const	getData = (event: React.MouseEvent<HTMLInputElement>) => {
			socket.emit('getPongies', (pongies: Pongie[]) => {
					setPongies(pongies);
			});
	
			createList(event.currentTarget.value);
		}
	
		const	createList = (text: string) => {			
			if (!text) {
				setList([]);
				setError(null);
				return ;
			}
	
			const	textlowerCase: string = text.toLocaleLowerCase();
			
			let		list: (Channel | Pongie | CreateOne)[] = [];
	
			list = list.concat(
				pongies.filter(pongie => pongie?.login.toLowerCase().includes(textlowerCase))
			);

			if (list.length === 0) {
				const	err: ListError = verifyPongie(text);

				if (err.error) {
					setList([]);
					setError(err);
					return ;
				}

				const	addPongie: CreateOne = {
					id: -1,
					avatar: {
						name: text,
						image: "",
						variant: "circular",
						borderColor: "#22d3ee",
						backgroundColor: "#22d3ee",
						text: text,
						empty: true,
						isChannel: false,
						decrypt: false,
					},
					name: "Add pongie " + text,
				}
				list = list.concat(addPongie);
			}
	
			setList(list);
		}

		return <Search
					list={list}
					error={error}
					getData={getData}
					createList={createList}
					handleBlur={handleBlur}
					openDisplay={openDisplay}
				/>
	}

	if (search === "myChannels") {

		const	getData = (event: React.MouseEvent<HTMLInputElement>) => {
			socket.emit('getChannels', (channels: Channel[]) => {
					setChannels(channels);
			});
	
			createList(event.currentTarget.value);
		}
	
		const	createList = (text: string) => {			
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

			if (list.length === 0) {
				const	err: ListError = verifyChannel(text);

				if (err.error) {
					setList([]);
					setError(err);
					return ;
				}

				const	addChannel: CreateOne = {
					id: -1,
					avatar: {
						name: text,
						image: "",
						variant: "rounded",
						borderColor: "#22d3ee",
						backgroundColor: "#22d3ee",
						text: text,
						empty: true,
						isChannel: true,
						decrypt: false,
					},
					name: "Add channel " + text,
				}
				list = list.concat(addChannel);
			}
	
			setList(list);
		}

		return <Search
					error={error}
					list={list}
					getData={getData}
					createList={createList}
					handleBlur={handleBlur}
					openDisplay={openDisplay}
				/>
	}
}
