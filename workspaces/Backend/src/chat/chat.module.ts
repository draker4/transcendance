/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { ChatService } from './service/chat.service';
import { UserPongieRelation } from 'src/utils/typeorm/UserPongieRelation';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { NotifMessages } from '@/utils/typeorm/NotifMessages.entity';
import { ChannelModule } from '@/channels/channel.module';
import { MessageModule } from '@/messages/messages.module';
import { UsersModule } from '@/users/users.module';
import { StatusModule } from '@/statusService/status.module';
import { AchievementModule } from '@/achievement/achievement.module';
import { StatsModule } from '@/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Notif,
      NotifMessages,
      SocketToken,
      User,
      UserChannelRelation,
      UserPongieRelation,
    ]),
    AchievementModule,
    ChannelModule,
    MessageModule,
    StatsModule,
    StatusModule,
    UsersModule,
  ],
  providers: [ChatGateway, CryptoService, ChatService],
})
export class ChatModule {}
