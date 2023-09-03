/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { UsersService } from '@/users/users.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { User } from '@/utils/typeorm/User.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Token } from '@/utils/typeorm/Token.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { Image } from '@/utils/typeorm/Image.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      Avatar,
      UserChannelRelation,
      User,
      BackupCode,
      SocketToken,
      Notif,
      Token,
      Stats,
      Image,
      Story,
      StoryData,
      Achievement,
      AchievementData,
    ]),
  ],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    UsersService,
    CryptoService,
    StatsService,
    StoryService,
    AchievementService,
  ],
})
export class ChannelModule {}
