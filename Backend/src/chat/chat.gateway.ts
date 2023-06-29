/* eslint-disable prettier/prettier */
import { OnModuleInit, Request, UseGuards } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WsJwtGuard } from "./guard/wsJwt.guard";
import { verify } from "jsonwebtoken";
import { Message } from "./dto/message.dto";

@UseGuards(WsJwtGuard)
@WebSocketGateway({
	cors: {
		origin: [`http://${process.env.HOST_IP}:3000`],
	},
	namespace: "/chat",
	path: "/chat/socket.io"
})
export class ChatGateway implements OnModuleInit {

	// Container of connected users : Map<userId, socket.id>
	private connectedUsers: Map<string, string> = new Map<string, string>();
	
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {

			const	token = socket.handshake.headers.authorization.split(' ')[1];
			
			try {
				const	payload = verify(token, process.env.JWT_SECRET) as any;

				if (!payload.sub) {
					socket.disconnect();
					return ;
				}
				
				this.connectedUsers.set(payload.sub, socket.id);

				socket.on('disconnect', () => {
					this.connectedUsers.delete(payload.sub);
					console.log(`User with ID ${payload.sub} disconnected`);
					console.log(this.connectedUsers);
				})
				console.log(this.connectedUsers);
			}
			catch(error) {
				console.log(error);
				socket.disconnect();
			}
		});
	}

	@SubscribeMessage('newMessage')
	create(@MessageBody() message: Message, @Request() req) {
		this.server.emit("onMessage", {
			"id": req.user.sub,
			"login": req.user.login,
			"text": message.text,
		});
	}
}
