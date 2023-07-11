import { Socket } from "socket.io-client";
import { useState } from "react";
import React from "react";
import Search from "./Search";

export default function SearchMyPongies({ socket, verifyPongie, openDisplay, placeHolder }: {
	socket: Socket;
	verifyPongie: (text: string) => ListError;
	openDisplay: (display: Display) => void;
	placeHolder: string;
}) {
	const	[pongies, setPongies] = useState<Pongie []>([]);
	const	[list, setList] = useState<(Channel | Pongie | CreateOne) []>([]);
	const	[error, setError] = useState<ListError | null>(null);

	const	handleBlur = () => {
		setList([]);
		setError(null);
	}

	const	handleClick = (item: Display) => {
		// socket.emit("addPongie")
		openDisplay(item);
	}

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
				type: "pongie",
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
				handleClick={handleClick}
				placeHolder={placeHolder}
			/>
}
