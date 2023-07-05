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

	
	const	handleBlur = () => {
		setList([]);
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
				return ;
			}
	
			const	textlowerCase: string = text.toLocaleLowerCase();
			
			let		list: (Channel | Pongie | CreateOne)[] = [];
	
			list = list.concat(
				pongies.filter(pongie => pongie?.login.toLowerCase().includes(textlowerCase))
			);

			if (list.length === 0) {
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
				return ;
			}
	
			const	textlowerCase: string = text.toLocaleLowerCase();
			
			let		list: (Channel | Pongie | CreateOne)[] = [];
	
			list = list.concat(
				channels.filter(channel => channel?.name.toLowerCase().includes(textlowerCase))
			);

			if (list.length === 0) {
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
					list={list}
					getData={getData}
					createList={createList}
					handleBlur={handleBlur}
					openDisplay={openDisplay}
				/>
	}
}
