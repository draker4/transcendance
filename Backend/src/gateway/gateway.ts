/* eslint-disable prettier/prettier */
import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: [`http://${process.env.HOST_IP}:3000`],
	}
})
export class MyGateway implements OnModuleInit {

	// Container of connected users : Map<userId, socket.id>
	private connectedUsers: Map<string, string> = new Map<string, string>();
	
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {
			const userId = socket.handshake.query.id as string;
			this.connectedUsers.set(userId, socket.id);

			socket.on('disconnect', () => {
				this.connectedUsers.delete(userId);
				console.log(`User with ID ${userId} disconnected`);
				console.log(this.connectedUsers);
			})
			console.log(this.connectedUsers);
		});
	}
}
