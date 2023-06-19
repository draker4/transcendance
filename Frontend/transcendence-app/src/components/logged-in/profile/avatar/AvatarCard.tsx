'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import avatarType from "@/types/Avatar.type";
import { CSSProperties, useState } from "react";

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

export default async function AvatarCard({profile, isOwner, avatar} : Props) {

	const [displaySettings, setDisplaySettings] = useState<boolean>(true);

	const fakeClick = () => {
		console.log("avatar clicked")
		// setDisplaySettings(true);
	}

	const toogleDisplaySettings = () => {
		if (displaySettings)
			setDisplaySettings(false);
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
					
					<Avatar avatar={avatar} onClick={fakeClick}/>
				</div>
				<ProfileLogin profile={profile} isOwner={isOwner}/>
		</div>
		<p>displaySettings value: {displaySettings ? 'ON' : 'OFF'}</p>
		{displaySettings && <div className={styles.settingsCard}></div>}
		<button onClick={toogleDisplaySettings}> Crash Button </button>
	</div>
  )
}
