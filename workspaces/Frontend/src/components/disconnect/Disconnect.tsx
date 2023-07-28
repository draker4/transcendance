import { cookies, headers } from "next/headers"
import DisconnectClient from "./DisconnectClient";

export default async function Disconnect() {

	const	token = cookies().get("crunchy-token");
	const	refreshToken = cookies().get("refresh-token");
	const	url = headers().get('referer');

	if ((token && token.value.length > 0
		|| refreshToken && refreshToken.value.length > 0)
		&& url?.includes("welcome")) {
		await fetch(`http://${process.env.HOST_IP}:3000/api/signoff?both=true`);
		return (
			<DisconnectClient />
		);
	}

	return (
		<></>
	)
}
