//Server side rendering
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/lobby/Lobby.module.css";
import Lobby from "@/components/lobby/Lobby";
import HomeProfile from "@/components/lobby/homeProfile/HomeProfile";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";
import Avatar_Service from "@/services/Avatar.service";
import Link from "next/link";
import HomeClient from "./HomeClient";

export default async function HomeServer() {
	let token: string;
	let avatar: Avatar = {
		image: "",
		variant: "circular",
		borderColor: "#22d3ee",
		backgroundColor: "#22d3ee",
		text: "",
		empty: true,
		isChannel: false,
		decrypt: false,
	};
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

	try {
		const	getToken = cookies().get("crunchy-token")?.value;
		if (!getToken)
			throw new Error("No token value");

		token = getToken;
		const profileData = new Profile_Service(token);
		profile = await profileData.getProfileByToken();
		if (profile.id === -1)
			throw new Error('no user');

		const Avatar = new Avatar_Service(token);
		avatar = await Avatar.getAvatarbyUserId(profile.id);
		
	} catch (error: any) {
		console.log(error.message);
		return (
			<div className={styles.error}>
				<h2>Oops... Something went wrong!</h2>
				<Link href={"/welcome"} className={styles.errorLink}>
					<p>Please, refresh the page</p>
				</Link>
			</div>
		)
	}

	return (
		<main className={styles.home}>
			<HomeClient profile={profile} avatar={avatar} token={token} />
		</main>
	);
}