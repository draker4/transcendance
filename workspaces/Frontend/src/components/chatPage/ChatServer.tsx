import { cookies } from "next/headers";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";
import ChatClient from "@/components/chatPage/ChatClient";
import Profile_Service from "@/services/Profile.service";

export default async function ChatServer({ channelId }: {
	channelId: number | undefined;
}) {
	let		token: string | undefined;
	let		myself: Profile & {
		avatar: Avatar;
	};

	try {
		const	getToken = cookies().get("crunchy-token")?.value;
		if (!getToken)
			throw new Error("No token value");

		token = getToken;

		const profilService = new Profile_Service(token);
		myself = await profilService.getProfileAndAvatar();
		if (myself.id === -1)
			throw new Error('no user');

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
		<ChatClient token={token} myself={myself} channelId={channelId} />
	)
}
