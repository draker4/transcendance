import { Socket } from "socket.io-client";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faFaceLaughBeam, faMessage } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faPlus, faSkull, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  borderColor: 'var(--tertiary1)',
	  right: "-4px",
	  cursor: "pointer",
	}
}

export default function PongieFooter({pongie, socket, cross, hidePongie}: {
	socket: Socket | undefined;
	pongie: Pongie;
	cross: boolean;
	hidePongie: () => void;
}) {

	const	router = useRouter();

	const	openProfile = () => {
		if (pongie) {
			router.push(`/home/profile/${pongie.id}`);
		}
	}

	const	addFriend = () => {
		if (!pongie.isFriend)
			socket?.emit('addPongie', pongie.id, (payload: {
				success: boolean;
				error: string;
				msg: string;
			}) => {
				if (!payload.success && payload.error === "isBlacklisted") {
					toast.error("You cannot send an invitation to this pongie!");
					return ;
				}

				if (payload.success && payload.msg === "friend")
					toast.success("Invitation accepted!");
					
				if (payload.success && payload.msg === "invited")
					toast.success("Invitation sent!");
			});
		
		if (pongie.isFriend)
			socket?.emit('deletePongie', pongie.id, (payload: {
				success: boolean;
			}) => {
				if (!payload.success) {
					toast.error("Something went wrong, try again!");
					return ;
				}

				if (payload.success)
					toast.success("Friend removed");
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
				<div onClick={addFriend}>
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
				</div>
			}

			<FontAwesomeIcon
				icon={faAddressCard}
				className={styles.icon}
				onClick={openProfile}
			/>

			<FontAwesomeIcon
				icon={faMessage}
				className={styles.icon}
			/>

			<FontAwesomeIcon
				icon={faSkull}
				className={styles.icon}
			/>

			{
				cross &&
				<FontAwesomeIcon
					icon={faXmark}
					className={styles.icon}
					onClick={hidePongie}
				/>
			}
			
		</div>
	);
}
