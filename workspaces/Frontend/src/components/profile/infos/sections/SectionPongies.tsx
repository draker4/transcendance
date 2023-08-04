import stylesInfoCard from "@/styles/profile/InfoCard.module.css";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { useEffect, useState } from "react";
import SearchBarPongies from "@/components/chatPage/searchBar/SearchBarPongies";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import { Socket } from "socket.io-client";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import PongieFooter from "./footerOptions/PongieFooter";
import React from "react";

export default function SectionPongies({socket}: {
	socket: Socket | undefined;
}) {

	const	[pongies, setPongies] = useState<Pongie[]>([]);
	const	[isInvited, setIsInvited] = useState<Pongie[]>([]);
	const	[hasInvited, setHasInvited] = useState<Pongie[]>([]);
	const	[pongieSearched, setPongieSearched] = useState<Pongie>();
	const	[isFocused, setIsFocused] = useState(false);

	const handleFocusOn = () => {
		setIsFocused(true);
	};

	const handleFocusOff = () => {
		setIsFocused(false);
	};

	const handleHover = () => {
		setIsFocused(true);
	};

	const handleMouseLeave = () => {
		setIsFocused(false);
	};

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

		const	updatePongies = (payload: {
			why: string;
		}) => {
			if (payload.why === "updatePongies")
				socket?.emit('getPongies', getPongies);
		}

		socket?.emit('getPongies', getPongies);

		socket?.on('notif', updatePongies);

		return () => {
			socket?.off('notif', updatePongies);
		}

	}, [socket]);

	const pongiesList = pongies.map(pongie => {
	
		return (
		  <React.Fragment key={pongie.id}>
			<div className={styles.pongieSearched} >
			  <div className={styles.avatar}>
				<AvatarUser
				  avatar={pongie.avatar}
				  borderSize="3px"
				  borderColor={pongie.avatar.borderColor}
				  backgroundColor={pongie.avatar.backgroundColor}
				/>
			  </div>
				<div className={styles.login} style={{color: pongie.avatar.borderColor}}>
					<h4>{pongie.login}</h4>
				</div>
			</div>
		  </React.Fragment>
		);
	});

	const isInvitedList = isInvited.map(pongie => {
	
		return (
		  <React.Fragment key={pongie.id}>
			<div className={styles.pongieSearched} >
			  <div className={styles.avatar}>
				<AvatarUser
				  avatar={pongie.avatar}
				  borderSize="3px"
				  borderColor={pongie.avatar.borderColor}
				  backgroundColor={pongie.avatar.backgroundColor}
				/>
			  </div>
				<div className={styles.login} style={{color: pongie.avatar.borderColor}}>
					<h4>{pongie.login}</h4>
				</div>
			</div>
		  </React.Fragment>
		);
	});

	const hasInvitedList = hasInvited.map(pongie => {
	
		return (
		  <React.Fragment key={pongie.id}>
			<div className={styles.pongieSearched} >
			  <div className={styles.avatar}>
				<AvatarUser
				  avatar={pongie.avatar}
				  borderSize="3px"
				  borderColor={pongie.avatar.borderColor}
				  backgroundColor={pongie.avatar.backgroundColor}
				/>
			  </div>
				<div className={styles.login} style={{color: pongie.avatar.borderColor}}>
					<h4>{pongie.login}</h4>
				</div>
			</div>
		  </React.Fragment>
		);
	});

	const	displayPongie = (display: Display) => {
		setPongieSearched(display);
	}

	if (!socket)
		return <LoadingSuspense />;

	return (
		<div className={stylesInfoCard.sections}>
			<SearchBarPongies
				displayPongie={displayPongie}
				socket={socket}
			/>

			{
				pongieSearched &&
				<div className={styles.part}
					onFocus={handleFocusOn}
				 	onBlur={handleFocusOff}
				  	onMouseEnter={handleHover}
				  	onMouseLeave={handleMouseLeave}
				>
					<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
						Pongie searched
					</p>
					<div className={styles.pongieSearched} >
						<div className={styles.avatar} >
							<AvatarUser
								avatar={pongieSearched.avatar}
								borderSize="3px"
								backgroundColor={pongieSearched.avatar.backgroundColor}
								borderColor={pongieSearched.avatar.borderColor}
							/>
						</div>
						<div className={styles.login} style={{color: pongieSearched.avatar.borderColor}}>
							<h4>{pongieSearched.login}</h4>
						</div>
					</div>
					{
						isFocused &&
						<PongieFooter pongie={pongieSearched} socket={socket} />
					}
				</div>
			}

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					My Pongies
				</p>
				{pongiesList}
			</div>

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					Invitations
				</p>
				{isInvitedList}
			</div>

			<div className={styles.part}>
				<p className={stylesInfoCard.tinyTitle} style={{fontSize: "0.9rem"}}>
					Invited Pongies
				</p>
				{hasInvitedList}
			</div>

		</div>
	);
}
