import { Socket, io } from "socket.io-client";

export default class ChatService {

    private static instance: ChatService | null = null;

	public	socket: Socket | undefined = undefined;
	public	reconnect: boolean = false;
	public	token: string | undefined;

	// Singleton
    constructor(token: string) {
        if (ChatService.instance 
			&& !ChatService.instance.reconnect
			&& ChatService.instance.token === token) {
			return ChatService.instance;
        }
		
		this.initializeSocket(token);
        ChatService.instance = this;
    }

	// Create socket + listen errors & exceptions
	private initializeSocket(token: string) {

		if (this.socket)
			this.disconnect(false);
		
		this.token = token;

		this.socket = io(`ws://${process.env.HOST_IP}:4000/chat`, {
		  extraHeaders: {
			Authorization: "Bearer " + token,
		  },
		  path: "/chat/socket.io",
		});
	
		// Catching error or exception will force disconnect then reconnect
		this.socket.on("connect_error", (error: any) => {
		//   console.log("Socket connection error:", error);
		  this.disconnect(true);
		});
	
		this.socket.on("error", (error: any) => {
		  console.log("Socket error:", error);
		  this.disconnect(true);
		});
	
		this.socket.on("exception", (exception: any) => {
		  console.log("WsException:", exception);
		  this.disconnect(true);
		});
	}

	// Disconnect socket + stop listen errors & exceptions
	public disconnect(reconnect: boolean) {
		if (this.socket) {
			this.socket.off("connect_error");
			this.socket.off("error");
			this.socket.off("exception");
			this.socket.disconnect();
			this.socket = undefined;
		}
		this.reconnect = reconnect;
	}
}
