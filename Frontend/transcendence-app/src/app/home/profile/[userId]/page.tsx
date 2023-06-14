import ProfileMainFrame from "@/components/logged-in/profile/ProfileMainFrame";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/Profile.module.css"
import { cookies } from 'next/dist/client/components/headers';


type Params = {
    params: {
        userId: string
    }
}

export default async function ProfilByIdPage({ params: { userId }}: Params) {
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

	let profileToDisplay = new Profile();

	try {
		const token = cookies().get("crunchy-token")?.value;
		if (!token)
		  throw new Error("No token value");
		
		profileToDisplay = await getProfileById(userId);
	  }
	  catch (err) {
		console.log(err);
	  }

	const isProfilOwner:boolean = profile.id === profileToDisplay.id ? true : false;
	/*  a determiner avec userId  en param dans version [userId]  */

  return (
	<main className={styles.main}>
		<ProfileMainFrame profile={profileToDisplay} isOwner={isProfilOwner}/>
	</main>
	
  )
}