import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/searchBar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useState } from "react";
import React from "react";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";

type AddChannel = {
	id: number,
	avatar: Avatar,
	name: string,
}

export default function Chat({ socket }: {
	socket: Socket;
}) {

	const	[channels, setChannels] = useState<Channel []>([]);
	const	[pongies, setPongies] = useState<Pongie []>([]);
	const	[list, setList] = useState<(Channel | Pongie | AddChannel) []>([]);

	const	renderList = list.map((item) => {

		let	key: string = item.id.toString();

		if ('name' in item)
			key = key.concat(" channel");
		else
			key = key.concat(" pongie");

		return (
			<React.Fragment key={key}>
				<li>
					<div className={styles.avatar}>
						<AvatarUser
							avatar={item.avatar}
							borderSize="1px"
							backgroundColor={item.avatar.backgroundColor}
							borderColor={item.avatar.borderColor}
						/>
					</div>
					{ 'name' in item &&
						<div className={styles.name}>
							{item.name}
						</div>
					}
					{ 'login' in item &&
						<div className={styles.name}>
							{item.login}
						</div>
					}
				</li>
			</React.Fragment>
		);
	});

	const	getAllConv = () => {
		socket.emit('getAllChannels', (channels: Channel[]) => {
				setChannels(channels);
		});
		socket.emit('getAllPongies', (pongies: Pongie[]) => {
				setPongies(pongies);
		});
	}

	const	handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		let		hasChannel: boolean = false;

		const	text = event.target.value.toLowerCase();
		if (!text) {
			setList([]);
			return ;
		}

		let		list: (Channel | Pongie | AddChannel)[] = [];
		list = list.concat(
			channels.filter(channel => channel?.name.toLowerCase().includes(text))
		);

		if (list.length !== 0)
			hasChannel = true;

		list = list.concat(
			pongies.filter(pongie => pongie?.login.toLowerCase().includes(text))
		);

		if (!hasChannel) {
			const	addChannel: AddChannel = {
				id: -1,
				avatar: {
					name: "",
					image: "",
					variant: "rounded",
					borderColor: "",
					backgroundColor: "",
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

	return (
		<div className={styles.main}>
			<div className={styles.searchBar}>
				<input
					type="text"
					placeholder="Search"
					onClick={getAllConv}
					onChange={handleSearch}
				/>
				<FontAwesomeIcon
					icon={faMagnifyingGlass}
					className={styles.icon}
				/>
			</div>
			{
				list.length !== 0 &&
				<div className={styles.dropdown}>
					<ul>
						{renderList}
					</ul>
				</div>
			}
		</div>
	)
}
