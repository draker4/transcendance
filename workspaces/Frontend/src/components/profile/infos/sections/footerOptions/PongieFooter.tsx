import { Socket } from "socket.io-client";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faFaceLaughBeam, faMessage } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faPlus, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  borderColor: 'var(--tertiary1)',
	  right: "-4px",
	}
}

export default function PongieFooter({pongie, socket}: {
	socket: Socket | undefined;
	pongie: Pongie;
}) {

	const	router = useRouter();
	// const	[isFriend, setIsFriend] = useState<boolean>(pongie.isfriend);

	const	openProfile = () => {
		if (pongie) {
			router.push(`/home/profile/${pongie.id}`);
		}
	}

	const	addFriend = () => {
		socket?.emit('addPongie', pongie.id, (payload: {
			success: boolean;
			error: string;
		}) => {
			if (!payload.success && payload.error === "isBlacklisted") {
				toast.error("You cannot send an invitation to this pongie!");
				return ;
			}
			toast.success("Invitation sent!");
		});
	}

	return (
		<div className={styles.footer}>

			{
				!pongie?.isFriend &&
				<div onClick={addFriend}>
					<Badge badgeContent={
						<FontAwesomeIcon
							icon={faPlus}
						/>} sx={badgeStyle}
						overlap="circular"
						className={styles.badge}
					>
						<FontAwesomeIcon
							icon={faFaceLaughBeam}
							className={styles.icon}
						/>
					</Badge>
				</div>
			}

			{
				pongie?.isFriend &&
				<Badge badgeContent={
					<FontAwesomeIcon
						icon={faCheck}
					/>
				} sx={badgeStyle} overlap="circular" >
					<FontAwesomeIcon
						icon={faFaceLaughBeam}
						className={styles.icon}
					/>
				</Badge>
			}

			<FontAwesomeIcon
				icon={faAddressCard}
				className={styles.icon + " " + styles.iconHover}
				onClick={openProfile}
			/>

			<FontAwesomeIcon
				icon={faMessage}
				className={styles.icon + " " + styles.iconHover}
			/>

			<FontAwesomeIcon
				icon={faSkull}
				className={styles.icon + " " + styles.iconHover}
			/>
			
		</div>
	);
}
