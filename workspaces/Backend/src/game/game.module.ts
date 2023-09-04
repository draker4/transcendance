// import standard nest packages
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import entities
import { Game } from 'src/utils/typeorm/Game.entity';
import { Score } from 'src/utils/typeorm/Score.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';

// import game providers
import { GameGateway } from './gateway/game.gateway';
import { GameManager } from './class/GameManager';
import { Pong } from './class/Pong';

// import external services
import { GameService } from './service/game.service';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';
import { UsersService } from '@/users/service/users.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { ColoredLogger } from './colored-logger';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { AvatarService } from '@/avatar/service/avatar.service';
import { ChannelService } from '@/channels/service/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { Image } from '@/utils/typeorm/Image.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { StatusModule } from '@/statusService/status.module';
import { Matchmaking } from '@/utils/typeorm/Matchmaking.entity';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';
import { ExperienceService } from '@/experience/service/experience.service';

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
      Image,
      Matchmaking,
      Notif,
      Score,
      SocketToken,
      Stats,
      Story,
      StoryData,
      Token,
      User,
      UserChannelRelation,
    ]),
    StatusModule,
  ],
  providers: [
    AchievementService,
    AvatarService,
    ChannelService,
    ColoredLogger,
    CryptoService,
    ExperienceService,
    GameGateway,
    GameService,
    GameManager,
    MatchmakingService,
    Pong,
    ScoreService,
    StatsService,
    StoryService,
    UsersService,
  ],
})
export class GameModule {}
