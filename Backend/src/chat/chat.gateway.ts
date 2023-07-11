/* eslint-disable prettier/prettier */
import { OnModuleInit, Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';
import { ChatService } from './chat.service';
import { newMsgDto } from './dto/newMsg.dto';
import { sendMsgDto } from './dto/sendMsg.dto';
import { MessagesService } from 'src/messages/messages.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: [
      `http://${process.env.HOST_IP}:3000`,
      "http://localhost:3000",
    ],
  },
  namespace: '/chat',
  path: '/chat/socket.io',
})
export class ChatGateway implements OnModuleInit {
  constructor(
	private readonly chatService: ChatService,
	private readonly messageService: MessagesService,
	) {}

  // Container of connected users : Map<userId, socket.id>
  private connectedUsers: Map<string, string> = new Map<string, string>();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const token = socket.handshake.headers.authorization?.split(' ')[1];

      try {
        const payload = verify(token, process.env.JWT_SECRET) as any;

        if (!payload.sub) {
          socket.disconnect();
          return;
        }

        this.connectedUsers.set(payload.sub, socket.id);

        socket.on('disconnect', () => {
          this.connectedUsers.delete(payload.sub);
          console.log(`User with ID ${payload.sub} disconnected`);
          console.log(this.connectedUsers);
        });

        // [+] ici gestion des room a join en fonction des channels de l'user ?
       socket.join("1 2"); // [!] en vrac&brut pour test

        console.log("connected users = ", this.connectedUsers);

      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }


  // [?] gestion de tous les message ou differencier les prives des autres ?
  // [?] ce qui change le plus c'est pour determiner le nom de la channel
  // [!] implementer un try catch ?
  @SubscribeMessage('newPrivateMsg')
  yoping(@MessageBody() message: newMsgDto, @Request() req) {
    if (this.chatService.checkPrivateMsgId(req.user.id, message.channel)) {
      // [?] Si la room n'existe pas elle est créée -> besoin de vérifier que la room existe ?


      // passer une une date en objet direct pose problème
      // conversion par ISOString
      const now = new Date();
      const nowtoISOString = now.toISOString();
   
      const sendMsg:sendMsgDto = {
        content: message.content,
        date: nowtoISOString,
        senderId: req.user.id,
		channelName: message.channel,
		channelId: message.channelId,
      }

      console.log("going to send " + sendMsg.content + " to " + message.channel); // checking - garder ce log ?
     
	  // [!][+] ici ajouter le message dans la database via messageService
	  this.messageService.addMessage(sendMsg);
	 
	  this.server.to(message.channel).emit('sendMsg', sendMsg);
    } else {
      // [?] Besoin de mieux sécuriser ou gérer ce cas ?
      // [!] Avec une throw WsException ?
      console.log("@SubscribeMessage('newPrivateMsg') error detected user id is ", req.user.id, "but channel name is ",  message.channel);
    }
  }

  @SubscribeMessage('getChannels')
  async getChannels(@Request() req) {
    return await this.chatService.getChannels(req.user.id);
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels(@Request() req) {
    return await this.chatService.getAllChannels(req.user.id);
  }

  @SubscribeMessage('getPongies')
  async getPongies(@Request() req) {
	  return await this.chatService.getPongies(req.user.id);
  }

  @SubscribeMessage('getAllPongies')
  async getAllPongies(@Request() req) {
	  return await this.chatService.getAllPongies(req.user.id);
  }

  // [!][+] add dto pour le data
  @SubscribeMessage('joinPrivateMsgChannel')
  async joinOrCreatePrivateMsgChannel( @MessageBody() data: { pongieId: string },
    @Request() req,
  ) {

    return await this.chatService.joinOrCreatePrivateMsgChannel(
      req.user.id,
      data.pongieId,
    );
  }

  @SubscribeMessage('addPongie')
  async addPongie(
    @MessageBody() pongieId: number,
    @Request() req
  ) {
    return await this.chatService.addPongie(req.user.id, pongieId);
  }

  @SubscribeMessage('deletePongie')
  async deletePongie(
    @MessageBody() pongieId: number,
    @Request() req
  ) {
    return await this.chatService.deletePongie(req.user.id, pongieId);
  }

  @SubscribeMessage('join')
  async join(
    @MessageBody() channelId: string,
    @Request() req,
    @ConnectedSocket() socket: Socket,
  ) {
    if (channelId.includes(".channel"))
      return await this.chatService.joinChannel(
        req.user.id,
        channelId.slice(0, channelId.length - 8),
        socket,
        this.server,
      );
    else
      return await this.chatService.joinPongie(
        req.user.id,
        channelId.slice(0, channelId.length - 8),
        socket,
        this.server,
      );
  }

  @SubscribeMessage("create")
  async createChannel(
    @MessageBody() channelName: string,
    @Request() req,
    @ConnectedSocket() socket: Socket,
  ) {
    return await this.chatService.create(
      req.user.id,
      channelName,
      socket,
      this.server,
    );
  }

}
