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

export default function ChannelFooter({channel, socket, crossFunction}: {
	socket: Socket | undefined;
	channel: Channel;
	crossFunction: (channel: Channel) => void;
}) {

	const	router = useRouter();

	const	openProfile = () => {
		if (channel) {
			router.push(`/home/channel/${channel.id}`);
		}
	}

	const	openChat = () => {
		socket?.emit('join', {
			id: channel.id,
			channelName: channel.name,
			channelType: channel.type,
		}, (payload: {
			success: boolean;
			exists: boolean;
			banned: boolean;
			channel: Channel;
		  }) => {

			if (payload.success)
				router.push(`/home/chat/${payload.channel.id}`)

			else if (payload.banned)
				toast.error("You are not allowed to see this channel!");

			else
				toast.error('Something went wrong, please try again!');
		});
	}

	return (
		<div className={styles.footer}>

			<FontAwesomeIcon
				icon={faAddressCard}
				className={styles.icon}
				onClick={openProfile}
			/>

			{
				!channel.isBanned &&
				<FontAwesomeIcon
					icon={faMessage}
					className={styles.icon}
					onClick={openChat}
				/>
			}

			<FontAwesomeIcon
				icon={faXmark}
				className={styles.icon}
				onClick={() => crossFunction(channel)}
			/>
			
		</div>
	);
}
