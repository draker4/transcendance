/* eslint-disable prettier/prettier */
import {
  OnModuleInit,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { verify } from 'jsonwebtoken';
import { ChatService } from './chat.service';
import { newMsgDto } from './dto/newMsg.dto';
import { User } from 'src/utils/typeorm/User.entity';
import { ChannelAuthGuard } from './guard/channelAuthGuard';
import { channelIdDto } from './dto/channelId.dto';
import { Channel } from 'src/utils/typeorm/Channel.entity';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: [`http://${process.env.HOST_IP}:3000`, 'http://localhost:3000'],
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

        //     socket.join('channel:1 2'); // [!] remis en brut pour tester tant que join pas implementer à chaque reco de socket
        // socket.join('channel:2'); // [!] ouh c'est moche

        this.connectedUsers.set(payload.sub, socket.id);
        this.chatService.joinAllMyChannels(socket, payload.sub);
        this.chatService.saveToken(token, payload.sub);

        socket.on('disconnect', () => {
          this.connectedUsers.delete(payload.sub);
          this.log(`User with ID ${payload.sub} disconnected`); // [?]
        });

        this.log('connected users = '); // [?]
        this.log(this.connectedUsers); // [?]
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  }

  @UseGuards(ChannelAuthGuard)
  @SubscribeMessage('newMsg')
  async receiveNewMsg(@MessageBody() message: newMsgDto, @Request() req) {
    await this.chatService.receiveNewMsg(message, req.user.id, this.server);
  }

  @SubscribeMessage('notif')
  async notif(@ConnectedSocket() socket) {
    this.server.to(socket.id).emit('notif');
  }

  @SubscribeMessage('getLoginWithAvatar')
  async getLoginWithAvatar(@Req() req) {
    return await this.chatService.getLoginWithAvatar(req.user.id);
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
    throw new WsException('test');
    return await this.chatService.getAllPongies(req.user.id);
  }

  @SubscribeMessage('addPongie')
  async addPongie(@MessageBody() pongieId: number, @Request() req) {
    return await this.chatService.addPongie(req.user.id, pongieId);
  }

  @SubscribeMessage('deletePongie')
  async deletePongie(@MessageBody() pongieId: number, @Request() req) {
    return await this.chatService.deletePongie(req.user.id, pongieId);
  }

  @SubscribeMessage('join')
  async join(
    @MessageBody()
    payload: {
      id: number;
      channelName: string;
      channelType: 'public' | 'protected' | 'private' | 'privateMsg';
    },
    @Request() req,
    @ConnectedSocket() socket: Socket,
  ) {
    if (payload.channelType === 'privateMsg')
      return await this.chatService.joinPongie(req.user.id, payload.id, socket);
    else
      return await this.chatService.joinChannel(
        req.user.id,
        payload.id,
        payload.channelName,
        payload.channelType,
        socket,
        this.server,
      );
  }

  @SubscribeMessage('leave')
  async leave(
    @MessageBody() channelId: number,
    @Request() req,
    @ConnectedSocket() socket,
  ) {
    return await this.chatService.leave(
      req.user.id,
      channelId,
      socket,
      this.server,
    );
  }

  @UseGuards(ChannelAuthGuard)
  @SubscribeMessage('getMessages')
  async getMessages(@MessageBody() payload: channelIdDto) {
    return (await this.chatService.getMessages(payload.id)).messages;
  }

  @UseGuards(ChannelAuthGuard)
  @SubscribeMessage('getChannelName')
  async getChannelName(@MessageBody() payload: channelIdDto) {
    this.log(`'getChannelName' event, with channelId: ${payload.id}`); // checking
    const channel: Channel = await this.chatService.getChannelById(payload.id);
    return {
      success: channel ? true : false,
      message: channel ? channel.name : '',
    };
  }

  // [!] au final pas utilisé dans <ChatChannel />
  @UseGuards(ChannelAuthGuard)
  @SubscribeMessage('getChannelUsers')
  async getChannelUsers(@MessageBody() payload: channelIdDto) {
    const id: number = payload.id;
    console.log('getChannelUsers proc --> ChannelId : ', id);

    const users: User[] = await this.chatService.getChannelUsers(payload.id);
    console.log(users);
    // [!] je laisse ces console log car pas pu tester cette fonction encore,
    // une fois qu'elle sera validée, retourner directement le resultat sans
    // variable intermédiaire

    return users;
  }

  // tools

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const green = '\x1b[32m';
    const stop = '\x1b[0m';

    process.stdout.write(green + '[chat gateway]  ' + stop);
    console.log(message);
  }
}
