'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import avatarType from "@/types/Avatar.type";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
    avatar: avatarType;
	onClick: () => void;
	displaySettings: boolean;
}

export default function Avatar({avatar, onClick, displaySettings } : Props) {

	return (
		<div className={styles.avatar}>
			<div className={styles.circle} onClick={onClick}>
				{!displaySettings && <AvatarUser 
					avatar={avatar} 
					borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)" 
					backgroundColor={avatar.backgroundColor} 
					borderColor={avatar.borderColor} />}
				{displaySettings && <AvatarUser 
						avatar={avatar}
						borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)" 
						backgroundColor="#6F3EBA" 
						borderColor="#2A7E97"/>}
			</div>
		</div>
	)
}
