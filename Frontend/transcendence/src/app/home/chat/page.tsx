import { cookies } from "next/headers";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";
import ChatClient from "@/components/chatPage/ChatClient";
import Profile_Service from "@/services/Profile.service";
import { Refresher } from "@/components/refresher/Refresher";

export default async function ChatPage() {
	let		token: string | undefined;
	let		myself: User;

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");

		const profilService = new Profile_Service(token);
		myself = await profilService.getProfileAndAvatar();

	} catch (err) {
		console.log(err);
		return (
			<div className={styles.error}>
				<h2>Oops... Something went wrong!</h2>
				<Link href={"/home"} className={styles.errorLink}>
					<p>Return to Home Page!</p>
				</Link>
			</div>
		)
	}

	return (
		<>
			<Refresher />
			<ChatClient token={token} myself={myself}/>
		</>
	)
}
