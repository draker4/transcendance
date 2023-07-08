/* eslint-disable prettier/prettier */
import { OnModuleInit, Request, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';
import { Message } from './dto/message.dto';
import { ChatService } from './chat.service';
import { newMsgDto } from './dto/newMsg.dto';
import { sendMsgDto } from './dto/sendMsg.dto';

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
  constructor(private readonly chatService: ChatService) {}

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

        // ici gestion des room a join en fonction des channels de l'user ?
        const testJoinRoom = socket.join("1 34"); // [!] en vrac pour test
        console.log("testJoinRoom = ", testJoinRoom);


        console.log("connected users = ", this.connectedUsers);

      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }


  @SubscribeMessage('newPrivateMsg')
  yoping(@MessageBody() message: newMsgDto, @Request() req) {
    console.log("req.user.login = ", req.user.login); // checking
    console.log("privateMessage : objet = ", message); // checking

    if (this.chatService.checkPrivateMsgId(req.user.id, message.channel)) {
      // [?] Si la room n'existe pas elle est créée -> besoin de vérifier que la room existe ?


      // passer une une date en objet direct pose problème
      // conversion par ISOString
      const now = new Date();
      const nowtoISOString = now.toISOString();
   
      // [!] test de comparaison deDate à jeter
      // const now3 = new Date(nowtoISOString);
      // console.log("nowtoISOString :", nowtoISOString);

      // console.log("now :", now);
      // console.log("pour now il est : "  + now.getHours() + ":" + now.getMinutes());
  
      // console.log("now3 :", now3);
      // console.log("pour now3 il est : "  + now3.getHours() + ":" + now3.getMinutes());


      const sendMsg:sendMsgDto = {
        content: message.content,
        date: nowtoISOString,
        senderId: req.user.id,
      }

      console.log("going to send " + sendMsg.content + " to " + message.channel);
      this.server.to(message.channel).emit('sendMsg', sendMsg);
    } else {
      // [?] Besoin de mieux sécuriser ou gérer ce cas ?
      console.log("@SubscribeMessage('newPrivateMsg') error detected user id is ", req.user.id, "but channel name is ",  message.channel);
    }

  }

  // [!] je laisse ça telquel pour le moment, je remplace avec dessus
  // [!] le fichier Message des dto sera a supprimer aussi
  @SubscribeMessage('newMessage')
  create(@MessageBody() message: Message, @Request() req) {
    this.server.emit('onMessage', {
      id: req.user.sub,
      login: req.user.login,
      text: message.text,
    });
  }

  @SubscribeMessage('getChannels')
  async getChannels(@Request() req) {
    return await this.chatService.getChannels(req.user.id);
  }

  @SubscribeMessage('getAllChannels')
  async getAllChannels() {
    return await this.chatService.getAllChannels();
  }

  @SubscribeMessage('getPongies')
  async getPongies(@Request() req) {
	  return await this.chatService.getPongies(req.user.id);
  }

  @SubscribeMessage('getAllPongies')
  async getAllPongies(@Request() req) {
	  return await this.chatService.getAllPongies(req.user.id);
  }

  // [!] add dto pour le data
  @SubscribeMessage('joinPrivateMsgChannel')
  async joinOrCreatePrivateMsgChannel( @MessageBody() data: { pongieId: string },
    @Request() req,
  ) {

    return await this.chatService.joinOrCreatePrivateMsgChannel(
      req.user.id,
      data.pongieId,
    );
  }




/* ------------------------------ tools -------------------------------------- */


}
