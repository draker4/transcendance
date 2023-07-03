import { cookies } from "next/headers";
import Link from "next/link";
import styles from "@/styles/chatPage/ChatPage.module.css";
import Conversations from "@/components/chatPage/Conversations";

export default async function ChatPage() {
	let token: string | undefined;

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token)
			throw new Error("No token value");
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
		<div>
			<Conversations token={token}/>
		</div>
	)
}
