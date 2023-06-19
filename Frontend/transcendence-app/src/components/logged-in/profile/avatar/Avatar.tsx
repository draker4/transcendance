'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import avatarType from "@/types/Avatar.type";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
    avatar: avatarType;
	onClick: () => void;
}

export default function Avatar({avatar, onClick } : Props) {

	return (
		<div className={styles.avatar}>
			<div className={styles.circle} onClick={onClick}>
				<AvatarUser avatar={avatar} borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)" />
			</div>
		</div>
	)
}
