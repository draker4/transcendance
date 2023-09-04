/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AvatarController } from './controller/avatar.controller';
import { AvatarService } from './service/avatar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UsersService } from 'src/users/service/users.service';
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
import { UsersModule } from '@/users/users.module';
import { Matchmaking } from '@/utils/typeorm/Matchmaking.entity';
import { Score } from '@/utils/typeorm/Score.entity';
import { Game } from '@/utils/typeorm/Game.entity';
import { StatusService } from '@/statusService/status.service';
import { GameService } from '@/game/service/game.service';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { ScoreService } from '@/score/service/score.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Achievement,
      AchievementData,
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
      Matchmaking,
      Game,
      Score,
    ]),
  ],
  controllers: [AvatarController],
  providers: [
    AchievementService,
    AvatarService,
    CryptoService,
    ChannelService,
    StatsService,
    UsersService,
    StoryService,
    GameService,
    MatchmakingService,
    ScoreService,
    StatusService,
  ],
})
export class AvatarModule {}
