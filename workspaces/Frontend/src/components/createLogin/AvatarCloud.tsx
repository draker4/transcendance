import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Badge } from "@mui/material";
import { useRef } from "react";
import styles from "@/styles/createLogin/ChooseAvatar.module.css";

const badgeStyle = {
	"& .MuiBadge-badge": {
	  color: 'var(--tertiary1)',
	  backgroundColor: 'var(--primary1)',
	  border: "2px solid var(--accent1)",
	  cursor: "pointer",
	  width: "6px",
	}
}

export default function AvatarCloud({
	avatar,
	selectedAvatar,
	text,
	handleSelectAvatar,
	colorBorder,
	backgroundColor,
}: {
	avatar: string;
	selectedAvatar: string;
	text: string;
	handleSelectAvatar: (key: string, avatar: Avatar) => void;
	colorBorder: string;
	backgroundColor: string;
}) {

	const	avatarRef = useRef<HTMLDivElement | null>(null);

	const deleteImageCloud = (url: string) => {
	  console.log(url);
	}

	return (
		<Badge badgeContent={
		  <FontAwesomeIcon
			icon={faTrash}
		  />} sx={badgeStyle}
		  overlap="circular"
		  anchorOrigin={{
			vertical: 'top',
			horizontal: 'right',
		  }}
		  className={styles.avatar}
		  onClick={(event) => {
			if (avatarRef.current && avatarRef.current.contains(event.target as Node)) {
				return ;
			}
			deleteImageCloud(avatar)
		  }}
		>
		  <Avatar
			className={`${styles.avatar} ${
			  avatar === selectedAvatar ? styles.selected : ""
			}`}
			src={avatar}
			alt={text}
			variant="circular"
			ref={avatarRef}
			onClick={() =>
			  handleSelectAvatar(avatar, {
				image: avatar,
				variant: "circular",
				borderColor: colorBorder,
				backgroundColor: backgroundColor,
				text: text,
				empty: false,
				isChannel: false,
				decrypt: true,
			  })
			}
			sx={{
			  width: 80,
			  height: 80,
			  border: `4px solid ${colorBorder}`,
			  backgroundColor: `${backgroundColor}`,
			}}
		  />
		</Badge>
	  );
}
