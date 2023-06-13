'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import avatarType from "@/types/Avatar.type";
import AvatarUser from "../../avatarUser/AvatarUser";

type Props = {
    avatar: avatarType;
}

export default function Avatar({avatar} : Props) {

	return (
		<div className={styles.avatar}>
			<div className={styles.circle}>
				<AvatarUser avatar={avatar}/>
			</div>
		</div>
	)
}
