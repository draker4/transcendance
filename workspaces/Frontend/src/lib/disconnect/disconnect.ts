import ChatService from "@/services/Chat.service";

export default async function disconnect(id?: string) {
	if (!id)
		id = "";

	ChatService.instance = null;
	
	try {
		await fetch(
			`http://${process.env.HOST_IP}:3000/api/signoff?id=${id}`, {
				credentials: "include",
			}
		);
	}
	catch (error) {
		console.log(error);
	}
}
