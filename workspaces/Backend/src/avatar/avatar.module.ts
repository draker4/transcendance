/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/utils/typeorm/User.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
import { ChannelService } from 'src/channels/channel.service';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { Image } from '@/utils/typeorm/Image.entity';
import { StoryService } from '@/story/service/story.service';
import { StoryData } from '@/utils/typeorm/StoryData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avatar,
      User,
      Channel,
      Token,
      UserChannelRelation,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
      Image,
      Story,
      StoryData,
    ]),
  ],
  controllers: [AvatarController],
  providers: [
    AvatarService,
    CryptoService,
    ChannelService,
    StatsService,
    UsersService,
    StoryService,
  ],
})
export class AvatarModule {}
