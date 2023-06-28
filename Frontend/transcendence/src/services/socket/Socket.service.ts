import { io } from "socket.io-client";

export default class SocketService {

    private static instance: SocketService;

	public	socket;

    constructor(id: string) {
        if (SocketService.instance) {
            return SocketService.instance;
        }
		this.socket = io(`http://${process.env.HOST_IP}:4000`, {
			query: {
			"id": id,
			}
		});
        SocketService.instance = this;
    }
}
