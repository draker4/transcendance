import { useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import AvatarUser from "@/components/avatarUser/AvatarUser";
import PongieFooter from "../footerOptions/PongieFooter";

export default function SectionPongies({pongie, socket, crossFunction}: {
	pongie: Pongie;
	socket: Socket | undefined;
	crossFunction: (pongie: Pongie) => void;
}) {
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

	return (
		<div
			onFocus={handleFocusOn}
			onBlur={handleFocusOff}
			onMouseEnter={handleHover}
			onMouseLeave={handleMouseLeave}
		>
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

			{
				isFocused &&
				<PongieFooter pongie={pongie} socket={socket} crossFunction={crossFunction} />
			}
		</div>
	);
}
