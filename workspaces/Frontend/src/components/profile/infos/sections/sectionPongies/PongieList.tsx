import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import PongieFooter from "../footerOptions/PongieFooter";
import { Badge } from "@mui/material";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--notif)',
    border: '2px solid var(--notif)',
    width: "12px",
    height: "12px",
    borderRadius: "100%",
	}
}

export default function PongieList({pongie, socket, crossFunction, notifsIds, setNotifIds}: {
	pongie: Pongie;
	socket: Socket | undefined;
	crossFunction: (pongie: Pongie) => void;
	notifsIds: number[];
	setNotifIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
	const	[isFocused, setIsFocused] = useState(false);
	const	[invisible, setInvisible] = useState(true);

	useEffect(() => {
		const	match = notifsIds.find(id => id === pongie.id);

		if (match && invisible)
			setInvisible(false);
		if (!match && !invisible)
			setInvisible(true);
	}, [notifsIds]);

	const handleFocusOn = () => {
		setIsFocused(true);
		setInvisible(true);
		const	ids = notifsIds.filter(id => id !== pongie.id);
		setNotifIds(ids);
		
		socket?.emit("clearNotif", {
			which: "redPongies",
			id: pongie.id,
		});
	};

	const handleFocusOff = () => {
		setIsFocused(false);
	};

	const handleHover = () => {
		setIsFocused(true);
		setInvisible(true);
		const	ids = notifsIds.filter(id => id !== pongie.id);
		setNotifIds(ids);
		socket?.emit("clearNotif", {
			which: "redPongies",
			id: pongie.id,
		});
	};

	const handleMouseLeave = () => {
		setIsFocused(false);
	};

	return (
		<div
			onFocus={handleFocusOn}
			onBlur={handleFocusOff}
			onMouseEnter={handleHover}
			onMouseLeave={handleMouseLeave}
		>
			<div className={styles.pongieSearched} >
				<Badge
					overlap="circular"
					sx={badgeStyle}
					variant="dot"
					invisible={invisible}
				>
					<div className={styles.avatar}>
						<AvatarUser
							avatar={pongie.avatar}
							borderSize="3px"
							borderColor={pongie.avatar.borderColor}
							backgroundColor={pongie.avatar.backgroundColor}
							fontSize="1rem"
						/>
					</div>
				</Badge>

				<div className={styles.login} style={{color: pongie.avatar.borderColor}}>
					<h4>{pongie.login}</h4>
				</div>

			</div>

			{
				isFocused &&
				<PongieFooter pongie={pongie} socket={socket} crossFunction={crossFunction} />
			}
		</div>
	);
}
