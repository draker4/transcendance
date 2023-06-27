import { cookies } from "next/dist/client/components/headers";
import Chat from "./Chat";
import { verifyAuth } from "@/lib/auth/auth";

export default async function ChatServer() {
	let	id: string = "";

	try {
		const token = cookies().get("crunchy-token")?.value;
		if (!token) throw new Error("No token value");
	
		const	payload = await verifyAuth(token);
		id = payload.sub as string;
	
	  } catch (err) {
		console.log(err);
	  }

	return (
		<Chat id={id}/>
	);
}
