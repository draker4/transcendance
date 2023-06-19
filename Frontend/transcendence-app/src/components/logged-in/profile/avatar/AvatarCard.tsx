'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import avatarType from "@/types/Avatar.type";
import { CSSProperties, useState } from "react";
import SettingsCard from "./SettingsCard"

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

export default function AvatarCard({profile, isOwner, avatar} : Props) {

	const [displaySettings, setDisplaySettings] = useState<boolean>(false);

	const toogleDisplaySettings = () => {
			setDisplaySettings(!displaySettings);
	}

	const colorAddedStyle:CSSProperties = {
	 	backgroundColor: avatar.borderColor,
	};


  return (
	<div className={styles.avatarFrame}>
		<div className={styles.avatarCard}>
				<div className={styles.rectangle} style={colorAddedStyle}>
					
					<div className={styles.top} style={colorAddedStyle}></div>
					<div className={styles.bot}></div>
					
					<Avatar avatar={avatar} onClick={toogleDisplaySettings} displaySettings={displaySettings}/>
				</div>
				<ProfileLogin profile={profile} isOwner={isOwner}/>
		</div>
		{displaySettings && <SettingsCard />}
	</div>
  )
}
