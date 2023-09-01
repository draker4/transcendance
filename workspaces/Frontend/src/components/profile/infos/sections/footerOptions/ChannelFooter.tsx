import { Socket } from "socket.io-client";
import styles from "@/styles/profile/Pongies/SectionPongies.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faMessage } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faPeopleGroup, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
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

	const	addChannel = () => {
		socket?.emit('join', {
			id: channel.id,
			channelName: channel.name,
			channelType: channel.type,
		}, (payload: {
			success: boolean;
			exists: boolean;
			banned: boolean;
			private: boolean;
			channel: Channel;
		  }) => {
			if (payload.success && payload.channel.joined)
				toast.success(`Welcome to ${channel.name}`);

			else if (payload.success)
				router.push(`/home/chat/${payload.channel.id}`);

			else if (payload.banned)
				toast.error("You are banned from this channel!");
			
			else if (payload.private)
				toast.error("You cannot see this channel, sorry!");

			else
				toast.error('Something went wrong, please try again!');
		});
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
			private: boolean;
			channel: Channel;
		  }) => {

			if (payload.success)
				router.push(`/home/chat/${payload.channel.id}`);

			else if (payload.banned)
				toast.error("You are banned from this channel!");
			
			else if (payload.private)
				toast.error("You cannot see this channel, sorry!");

			else
				toast.error('Something went wrong, please try again!');
		});
	}

	return (
		<div className={styles.footer}>

			{
				!channel?.joined && !channel.isBanned &&
				<div onClick={addChannel}>
					<Badge badgeContent={
						<FontAwesomeIcon
							icon={faPlus}
						/>} sx={badgeStyle}
						style={{cursor: 'pointer'}}
						overlap="circular"
					>
						<FontAwesomeIcon
							icon={faPeopleGroup}
							className={styles.icon}
						/>
					</Badge>
				</div>
			}

			{
				channel?.joined && !channel.isBanned &&
				<Badge badgeContent={
					<FontAwesomeIcon
						icon={faCheck}
					/>
				} sx={badgeStyle} overlap="circular" >
					<FontAwesomeIcon
						icon={faPeopleGroup}
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
