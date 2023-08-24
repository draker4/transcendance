/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from 'src/channels/channel.service';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Message } from 'src/utils/typeorm/Message.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { MessagesService } from './messages.service';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { Image } from '@/utils/typeorm/Image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      Channel,
      Avatar,
      User,
      UserChannelRelation,
      Token,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
      Image,
    ]),
  ],
  providers: [
    MessagesService,
    ChannelService,
    UsersService,
    CryptoService,
    StatsService,
  ],
})
export class MessageModule {}
