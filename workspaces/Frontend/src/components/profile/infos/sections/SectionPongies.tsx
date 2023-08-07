import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { useEffect, useRef, useState } from "react";
import SearchBarPongies from "@/components/chatPage/searchBar/SearchBarPongies";
import { Socket } from "socket.io-client";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import React from "react";
import PongieList from "./sectionPongies/PongieList";

export default function SectionPongies({socket}: {
	socket: Socket | undefined;
}) {

	const	[pongies, setPongies] = useState<Pongie[]>([]);
	const	[isInvited, setIsInvited] = useState<Pongie[]>([]);
	const	[hasInvited, setHasInvited] = useState<Pongie[]>([]);
	const	[pongieSearched, setPongieSearched] = useState<Pongie | undefined>();
	const	pongieSearchedId = useRef<number | undefined>();

	useEffect(() => {

		const	getPongies = (payload: Pongie[]) => {
			const	isInvited: Pongie[] = [];
			const	hasInvited: Pongie[] = [];
			const	pongies: Pongie[] = [];

			for (const	pongie of payload) {
				if (pongie.isFriend)
					pongies.push(pongie);
				else if (pongie.hasInvited)
					hasInvited.push(pongie);
				else if (pongie.isInvited)
					isInvited.push(pongie);
			}
			
			setPongies(pongies);
			setIsInvited(isInvited);
			setHasInvited(hasInvited);
		}

		const	updatePongieSearched = (payload: Pongie | { error: string }) => {
			if ('error' in payload)
				setPongieSearched(undefined);
			else
				setPongieSearched(payload);
		}

		const	updatePongies = (payload: {
			why: string;
		}) => {
			if (payload.why === "updatePongies") {
				socket?.emit('getPongies', getPongies);
				if (pongieSearchedId.current)
					socket?.emit('getPongie', pongieSearchedId.current, updatePongieSearched);
			}
		}

		socket?.emit('getPongies', getPongies);

		socket?.on('notif', updatePongies);

		return () => {
			socket?.off('notif', updatePongies);
		}

	}, [socket]);

	const pongiesList = pongies.map(pongie => {
		return (
			<div key={pongie.id}>
				<PongieList pongie={pongie} socket={socket} />
			</div>
		);
	});

	const isInvitedList = isInvited.map(pongie => {
		return (
			<div key={pongie.id}>
				<PongieList pongie={pongie} socket={socket} />
			</div>
		);
	});

	const hasInvitedList = hasInvited.map(pongie => {
		return (
			<div key={pongie.id}>
				<PongieList pongie={pongie} socket={socket} />
			</div>
		);
	});

	if (!socket)
		return <LoadingSuspense />;

	return (
		<div className={stylesInfoCard.sections}>
			<SearchBarPongies
				socket={socket}
				setPongieSearched={setPongieSearched}
				pongieSearchedId={pongieSearchedId}
			/>

			{
				pongieSearched &&
				<div className={styles.part}>
					<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
						Pongie Searched
					</p>
					<PongieList pongie={pongieSearched} socket={socket} />
				</div>
			}

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					All my Pongies
				</p>
				{pongiesList}
			</div>

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					Invitations received
				</p>
				{isInvitedList}
			</div>

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					Invitation sent
				</p>
				{hasInvitedList}
			</div>

		</div>
	);
}
