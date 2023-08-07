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
	}
}

export default function PongieFooter({pongie, socket, crossFunction}: {
	socket: Socket | undefined;
	pongie: Pongie;
	crossFunction: (pongie: Pongie) => void;
}) {

	const	router = useRouter();

	const	openProfile = () => {
		if (pongie) {
			router.push(`/home/profile/${pongie.id}`);
		}
	}

	const	addFriend = () => {
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
	}

	const	blackList = () => {
		socket?.emit('blacklist', pongie.id, (payload: {
			success: boolean;
		}) => {
			if (payload && payload.success)
				toast.info("Pongie added to the blacklist!");
		});
	}

	return (
		<div className={styles.footer}>

			{
				!pongie?.isFriend && !pongie.hasBlacklisted &&
				<div onClick={addFriend}>
					<Badge badgeContent={
						<FontAwesomeIcon
							icon={faPlus}
						/>} sx={badgeStyle}
						style={{cursor: 'pointer'}}
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
				pongie?.isFriend && !pongie.hasBlacklisted &&
				<Badge badgeContent={
					<FontAwesomeIcon
						icon={faCheck}
					/>
				} sx={badgeStyle} overlap="circular" >
					<FontAwesomeIcon
						icon={faFaceLaughBeam}
						className={styles.iconFriend}
						style={{color: "#8bc34a"}}
					/>
				</Badge>
			}

			<FontAwesomeIcon
				icon={faAddressCard}
				className={styles.icon}
				onClick={openProfile}
			/>

			{
				!pongie.hasBlacklisted &&
				<FontAwesomeIcon
					icon={faMessage}
					className={styles.icon}
				/>
			}

			{
				!pongie.hasBlacklisted &&
				<FontAwesomeIcon
					icon={faSkull}
					className={styles.icon}
					onClick={blackList}
				/>
			}

			<FontAwesomeIcon
				icon={faXmark}
				className={styles.icon}
				onClick={() => crossFunction(pongie)}
			/>
			
		</div>
	);
}
