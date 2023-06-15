import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import { CryptoService } from "@/services/crypto/Crypto.service";
import avatarType from "@/types/Avatar.type";
import { getAvatarByLogin } from "@/lib/avatar/getAvatarByLogin";
import { cookies } from "next/dist/client/components/headers";
import { CSSProperties } from "react";

type Props = {
    profile: Profile;
	isOwner: boolean;
	avatar: avatarType;
}

const	Crypto = new CryptoService();

export default async function AvatarCard({profile, isOwner, avatar} : Props) {

	const avatarAltValue: string = `player ${profile.login}'s avatar`;

	const colorAddedStyle:CSSProperties = {
	 	backgroundColor: avatar.borderColor,
	};



  return (
	<div className={`${styles.avatarCard}`}>
		<div className={styles.rectangle} style={colorAddedStyle}>
			
			<div className={styles.top} style={colorAddedStyle}></div>
			<div className={styles.bot}></div>
			
			<Avatar avatar={avatar}/>
		</div>
		<ProfileLogin profile={profile} isOwner={isOwner}/>
	</div>
  )
}
