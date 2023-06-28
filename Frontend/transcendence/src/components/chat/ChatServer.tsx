import { cookies } from "next/dist/client/components/headers";
import ChatClient from "./ChatClient";

export default async function ChatServer() {
	let	token: string | undefined;

	try {
		token = cookies().get("crunchy-token")?.value;
		if (!token) throw new Error("No token value");
	
	  } catch (err) {
		console.log(err);
	  }

	return (
		<ChatClient token={token}/>
	);
}
