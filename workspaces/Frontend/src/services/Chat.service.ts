import { Socket, io } from "socket.io-client";

export default class ChatService {

    private static instance: ChatService | null = null;

	public	socket: Socket | undefined = undefined;
	public	token: string | undefined;

	// Singleton
    constructor(token?: string) {
		// console.log("constructor");
        if (ChatService.instance) {
			// console.log("instance returned");
			return ChatService.instance;
		}
		
		if (token) {
			// console.log("socket initialized");
			this.initializeSocket(token);
			ChatService.instance = this;
		}
		else {
			// console.log("socket disconnected");
			this.socket?.disconnect();
		}
    }

	// Create socket + listen errors & exceptions
	public initializeSocket(token: string) {

		console.log("initialization with token = ", token);
		if (this.socket)
			this.disconnect();
		
		this.token = token;

		this.socket = io(`ws://${process.env.HOST_IP}:4000/chat`, {
		  extraHeaders: {
			Authorization: "Bearer " + token,
		  },
		  path: "/chat/socket.io",
		});

		this.socket.on('connect', () => {
			console.log('WebSocket connected id=', this.socket?.id);
		});
		  
		this.socket.on('disconnect', () => {
			console.log('WebSocket disconnected id=', this.socket?.id);
		});
	
		// Catching error or exception will force disconnect then reconnect
		this.socket.on("connect_error", (error: any) => {
		//   console.log("Socket connection error:", error);
		  this.disconnect();
		});
	
		this.socket.on("error", (error: any) => {
		  console.log("Socket error:", error);
		  this.disconnect();
		});
	
		this.socket.on("exception", (exception: any) => {
		  	console.log("WsException:", exception);
			this.disconnect();
		});

		this.socket.on('refresh', () => {
			console.log('refresh event for socket id=', this.socket?.id);
			this.refreshSocket("refresh");
			// this.disconnect();
		});

	}

	// Disconnect socket + stop listen errors & exceptions
	public disconnect() {
		if (this.socket) {
			this.socket.off("connect_error");
			this.socket.off("error");
			this.socket.off("exception");
			this.socket.off("refresh");
			this.socket.disconnect();
			this.socket = undefined;
		}
	}

	private async refreshSocket(text: string) {
		try {
		  console.log("trying to refresh token from ", text);
		  const res = await fetch(
			`http://${process.env.HOST_IP}:4000/api/auth/refreshToken`, {
			  method: "POST",
			  credentials: "include",
			}
		  );
	
		  if (!res)
			throw new Error("fetch failed");
		  
		  const data = await res.json()
	
		  const resApi = await fetch(`http://${process.env.HOST_IP}:3000/api/auth/setCookies`, {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  accessToken: data.access_token,
			  refreshToken: data.refresh_token,
			}),
		  });
	
		  if (!resApi.ok)
			throw new Error("fetch api failed");
		  
		  this.disconnect();
		  this.token = data.access_token;
		  this.initializeSocket(data.access_token);
		  this.socket?.emit('notif');
		}
		catch (error) {
		  await fetch(
			`http://${process.env.HOST_IP}:3000/api/signoff`
		  );
		}
	  }
}
