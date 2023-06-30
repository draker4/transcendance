import { io } from "socket.io-client";

export default class ChatService {

    private static instance: ChatService;

	public	socket;

    constructor(id: string) {
        if (ChatService.instance) {
            return ChatService.instance;
        }
		this.socket = io(`http://${process.env.HOST_IP}:4000/chat`, {
            query: {
            "id": id,
            },
            path: "/chat/socket.io"
        });
        ChatService.instance = this;
    }
}
