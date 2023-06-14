'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import avatarType from "@/types/Avatar.type";
import { CSSProperties } from "react";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
    avatar: avatarType;
}

export default function Avatar({avatar} : Props) {



	// const circleAddedStyle:CSSProperties = {
	// 	borderColor: avatar.borderColor,
	// };
	
	// "clamp(0.4rem, 0.2rem + 1.4vw, 1.6rem)"

	return (
		<div className={styles.avatar}>
			<div className={styles.circle}>
				<AvatarUser avatar={avatar} borderSize="clamp(0.2rem, 0.1rem + 0.7vw, 0.8rem)" />
			</div>
		</div>
	)
}
