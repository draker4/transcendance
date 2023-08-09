//Server side rendering
import { cookies } from "next/dist/client/components/headers";

//Import le composant pour le lobby
import styles from "@/styles/lobby/Lobby.module.css";
import Lobby from "@/components/lobby/Lobby";
import HomeProfile from "@/components/lobby/homeProfile/HomeProfile";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";
import { Suspense } from "react";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import Avatar_Service from "@/services/Avatar.service";

export default async function HomePage() {
	let token: string | undefined;
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
		token = cookies().get("crunchy-token")?.value;
		if (!token) throw new Error("No token value");

		const profileData = new Profile_Service(token);
		profile = await profileData.getProfileByToken();

		const Avatar = new Avatar_Service(token);
		avatar = await Avatar.getAvatarbyUserId(profile.id);
		
	} catch (error) {
		console.log(error);
	}

	return (
		<main className={styles.home}>
			<Refresher />
			<Suspense fallback={<LoadingSuspense />}>
				<HomeProfile profile={profile} avatar={avatar} />
				<Lobby profile={profile} avatar={avatar} />
			</Suspense>
		</main>
	);
}
