/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from '@/channels/service/channel.service';
import { UsersService } from 'src/users/service/users.service';
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
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';
import { ExperienceService } from '@/experience/service/experience.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementData,
      Avatar,
      BackupCode,
      Channel,
      ExperienceData,
      Message,
      Notif,
      Image,
      SocketToken,
      Stats,
      Story,
      StoryData,
      Token,
      User,
      UserChannelRelation,
    ]),
  ],
  providers: [
    AchievementService,
    ChannelService,
    CryptoService,
    ExperienceService,
    MessagesService,
    StatsService,
    StoryService,
    UsersService,
  ],
})
export class MessageModule {}
