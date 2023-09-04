import Profile_Service from "@/services/Profile.service";
import { cookies } from "next/headers";
import fs from "fs";
import FormLogin from "./FormLogin";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";

export default async function CreateServer() {

	let profile: Profile = {
		id: -1,
		login: "",
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		image: "",
		provider: "",
		motto: "",
		story: "",
	};
	let token: string | undefined = undefined;
	let avatars: string[] = [];
	let avatarCrypted: string | undefined = undefined;

	try {
		const	getToken = cookies().get("crunchy-token")?.value;
		if (!getToken)
			throw new Error("No token value");

		token = getToken;

		const profileData = new Profile_Service(token);
		profile = await profileData.getProfileByToken();

		if (profile.id === -1)
			throw new Error('no user');

		const directoryPath = "/home/workspaces/Frontend/public/images/avatars";
		avatars = fs.readdirSync(directoryPath);

		avatars = avatars.map((avatar) => {
			if (avatar.includes("avatar"))
				return "/images/avatars/" + avatar;
			return avatar;
		});

	} catch (err) {

		return (
			<div className={styles.error}>
				<p>An error occured</p>	
				<Link href='/welcome/disconnect' className={styles.errorLink}>
					Return to login page
				</Link>
			</div>
		);
	}

  	if (profile.provider === "42")
		avatarCrypted = profile.image;

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<FormLogin token={token as string} avatars={avatars} avatarCrypted={avatarCrypted} />
		</div>
	);
}
