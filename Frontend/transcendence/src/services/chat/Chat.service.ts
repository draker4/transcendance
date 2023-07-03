import { io } from "socket.io-client";

export default class ChatService {

    private static instance: ChatService | null = null;

	public	socket;

    constructor(token: string) {
        if (ChatService.instance) {
            return ChatService.instance;
        }
		this.socket = io(`http://${process.env.HOST_IP}:4000/chat`, {
				extraHeaders: {
					Authorization: "Bearer " + token,
				},
				path: "/chat/socket.io"
		});
        ChatService.instance = this;
    }
}
