import ChatServer from "@/components/chatPage/ChatServer";
import LoadingSuspense from "@/components/loading/LoadingSuspense";
import { Refresher } from "@/components/refresher/Refresher";
import { Suspense } from "react";

export default async function ChatPage() {
	return (
		<>
			<Refresher />
			<Suspense fallback={<LoadingSuspense/>}>
				<ChatServer />
			</Suspense>
		</>
	)
}
