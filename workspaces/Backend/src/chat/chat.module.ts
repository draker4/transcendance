/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { ChatService } from './chat.service';
import { ChannelService } from 'src/channels/channel.service';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UserPongieRelation } from 'src/utils/typeorm/UserPongieRelation';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { MessagesService } from 'src/messages/messages.service';
import { Message } from 'src/utils/typeorm/Message.entity';
import { ChannelAuthGuard } from './guard/channelAuthGuard';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { NotifMessages } from '@/utils/typeorm/NotifMessages.entity';
import { StatsService } from '@/stats/service/stats.service';
import { StatusService } from '@/statusService/status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Channel,
      Avatar,
      UserPongieRelation,
      UserChannelRelation,
      Message,
      Token,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
      NotifMessages,
    ]),
  ],
  providers: [
    ChatGateway,
    WsJwtGuard,
    ChannelAuthGuard,
    UsersService,
    CryptoService,
    ChatService,
    ChannelService,
    MessagesService,
    StatsService,
    StatusService,
  ],
})
export class ChatModule {}
