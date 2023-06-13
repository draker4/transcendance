import styles from "@/styles/profile/AvatarCard.module.css"
import Profile from "@/services/Profile.service"
import Avatar from "./Avatar"
import ProfileLogin from "./ProfileLogin"
import { CryptoService } from "@/services/crypto/Crypto.service";
import avatarType from "@/types/Avatar.type";
import { getAvatarByToken } from "@/lib/avatar/getAvatarByToken";
import { cookies } from "next/dist/client/components/headers";

type Props = {
    profile: Profile;
}

const	Crypto = new CryptoService();

export default async function AvatarCard({profile} : Props) {

	const avatarAltValue: string = `player ${profile.login}'s avatar`;

	let token: string | undefined = "";
	let	avatar: avatarType = {
		image: "",
		variant: "",
		borderColor: "",
		text: "",
		empty: true,
	};

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
	
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



  return (
	<div className={`${styles.avatarCard}`}>
		<Avatar avatar={avatar}/>
		<ProfileLogin profile={profile}/>
	</div>
  )
}
