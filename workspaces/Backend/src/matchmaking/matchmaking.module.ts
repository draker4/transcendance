import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchmakingService } from './service/matchmaking.service';
import { MatchmakingController } from './controller/matchmaking.controller';

import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { GameService } from '@/game/service/game.service';
import { ScoreService } from '@/score/service/score.service';
import { Score } from '@/utils/typeorm/Score.entity';
import { UsersService } from '@/users/service/users.service';
import { AvatarService } from '@/avatar/service/avatar.service';
import { Channel } from '@/utils/typeorm/Channel.entity';
import { Token } from '@/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { CryptoService } from '@/utils/crypto/crypto';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/service/channel.service';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { StatsService } from '@/stats/service/stats.service';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { Image } from '@/utils/typeorm/Image.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { StatusService } from '@/statusService/status.service';
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
      Game,
      Matchmaking,
      Score,
      Stats,
      Token,
      User,
      UserChannelRelation,
      SocketToken,
      Notif,
      Image,
      Story,
      StoryData,
    ]),
  ],
  controllers: [MatchmakingController],
  providers: [
    AchievementService,
    AvatarService,
    ChannelService,
    CryptoService,
    ExperienceService,
    GameService,
    MatchmakingService,
    ScoreService,
    StatsService,
    StoryService,
    StatusService,
    UsersService,
  ],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
