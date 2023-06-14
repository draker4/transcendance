import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import { CryptoService } from "@/services/crypto/Crypto.service";
import avatarType from "@/types/Avatar.type";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import { cookies } from "next/dist/client/components/headers";
import { CSSProperties } from "react";

type Props = {
    profile: Profile;
	isOwner: boolean;
}

const	Crypto = new CryptoService();

export default async function AvatarCard({profile, isOwner} : Props) {

	const avatarAltValue: string = `player ${profile.login}'s avatar`;

	let token: string | undefined = "";
	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		text: "",
		empty: true,
		backgroundColor: ""
	};

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
	
			
	/* ICI A TERMINER */
	// const	data = isOwner ? await getAvatarByToken(token) : await getAvatarById();

	const	data = await getAvatarByToken(token);

	if (!data.error && data.image) {
		avatar = data;
		if (avatar.image.length > 0)
			avatar.image = await Crypto.decrypt(avatar.image);
	}
	else
		avatar.empty = true;
	}	catch (err) {
	console.log(err);
	}

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
