import ProfileMainFrame from "@/components/logged-in/profile/ProfileMainFrame";
import { verifyAuth } from "@/lib/auth/auth";
import { getAvatarByLogin } from "@/lib/avatar/getAvatarByLogin";
import { getProfileByLogin, getProfileByToken } from "@/lib/profile/getProfileInfos";
import { CryptoService } from "@/services/crypto/Crypto.service";
import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css"
import avatarType from "@/types/Avatar.type";
import { cookies } from 'next/dist/client/components/headers';


type Params = {
    params: {
        login: string
    }
}

const Crypto = new CryptoService();

export default async function ProfilByIdPage({ params: { login }}: Params) {
	let profile = new Profile();
	let isProfilOwner:boolean = false;
	let avatar:avatarType = {
		login: "",
		image: "",
		variant: "",
		borderColor: "",
		backgroundColor: "",
		text: "",
		empty: true,
	}

	try {
		const token = cookies().get("crunchy-token")?.value;
		if (!token)
		  throw new Error("No token value");
		
		profile = await getProfileByLogin(token, login);

		avatar = await getAvatarByLogin(token, login);

		if (avatar.image.length > 0)
			avatar.image = await Crypto.decrypt(avatar.image);

		const payload = await verifyAuth(token);

		if (payload.login === login)
			isProfilOwner = true;

	  }
	  catch (err) {
		console.log(err);
	  }

  return (
	<main className={styles.main}>
		<ProfileMainFrame profile={profile} avatar={avatar} isOwner={isProfilOwner}/>
	</main>
	
  )
}