'use client'

import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import avatarType from "@/types/Avatar.type";
import { CSSProperties, useState } from "react";
import SettingsCard from "./SettingsCard"
import { Color, ColorChangeHandler, ColorResult } from "react-color"

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

export default function AvatarCard({profile, isOwner, avatar} : Props) {

	const [displaySettings, setDisplaySettings] = useState<boolean>(false);
	const [topColor, setTopColor] = useState<Color>(avatar.borderColor);


	const toogleDisplaySettings = () => {
			
		if (displaySettings === true)
			cancelColorChanges();
		setDisplaySettings(!displaySettings);

	}

	const colorAddedStyle:CSSProperties = {
	 	backgroundColor: topColor.toString(),
	};


	const previewChangeColor: ColorChangeHandler = (color:ColorResult) => {
		setTopColor(color.hex);
	}

	const cancelColorChanges = () => {
		setTopColor(avatar.borderColor);
	}


  return (
	<div className={styles.avatarFrame}>
		<div className={styles.avatarCard}>
				<div className={styles.rectangle} style={colorAddedStyle}>
					
					<div className={styles.top} style={colorAddedStyle}></div>
					<div className={styles.bot}></div>
					
					<Avatar avatar={avatar}
							onClick={toogleDisplaySettings}
							displaySettings={displaySettings}
							previewBorder={topColor.toString()} />
				</div>
				<ProfileLogin profile={profile} isOwner={isOwner}/>
		</div>
		{displaySettings && <SettingsCard previewChangeColor={previewChangeColor}/>}
	</div>
  )
}
