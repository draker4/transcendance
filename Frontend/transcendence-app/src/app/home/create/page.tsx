import ChooseAvatar from "@/components/logged-in/create/ChooseAvatar";
import { getProfileByToken } from "@/lib/profile/getProfileInfos";
import Profile from "@/services/Profile.service";
import styles from "@/styles/create/Create.module.css";
import { cookies } from 'next/dist/client/components/headers';

export default async function CreatePage() {
	
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

	return (
		<div className={styles.main}>
			<h3>You're almost there! 😁</h3>
			<form>
				<label>
					Please choose your login!
				</label>
				<p>Don't worry, you can change it later.</p>
				<input type="text" name="login" placeholder="login"/>
			</form>
			<div className={styles.avatars}>
				<ChooseAvatar profile={profile}/>
			</div>
		</div>
	);
}
