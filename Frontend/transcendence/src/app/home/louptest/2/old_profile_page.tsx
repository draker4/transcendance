import ProfileMainFrame from "@/components/logged-in/profile/ProfileMainFrame";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css"
import { cookies } from 'next/dist/client/components/headers';

export default async function ProfilePage() {

	let profile = new Profile();
	
	try {
		const token = cookies().get("crunchy-token")?.value;
		if (!token)
		  throw new Error("No token value");
		
		profile = await getProfileByToken(token);
	  }
	  catch (err) {
		console.log(err);
	  }

	const isProfilOwner:boolean = false;
	/*  a determiner avec userId  en param dans version [userId]  */

  return (
	<main className={styles.main}>
		<ProfileMainFrame profile={profile} isOwner={isProfilOwner}/>
	</main>
	
  )
}
