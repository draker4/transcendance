import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MailModule } from 'src/mail/mail.module';
import { CryptoService } from 'src/utils/crypto/crypto';
import { GoogleStrategy } from './strategies/google.strategy';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { AvatarService } from 'src/avatar/service/avatar.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { ChannelService } from '@/channels/service/channel.service';
import { AuthService } from './services/auth.service';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { Image } from '@/utils/typeorm/Image.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { GameService } from '@/game/service/game.service';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { Matchmaking } from '@/utils/typeorm/Matchmaking.entity';
import { Game } from '@/utils/typeorm/Game.entity';
import { ScoreService } from '@/score/service/score.service';
import { StatusService } from '@/statusService/status.service';
import { Score } from '@/utils/typeorm/Score.entity';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';
import { ExperienceService } from '@/experience/service/experience.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';

@Module({
  imports: [
    PassportModule,
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
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AchievementService,
    AuthService,
    AvatarService,
    ChannelService,
    CryptoService,
    ExperienceService,
    GameService,
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    MatchmakingService,
    StatsService,
    StoryService,
    ScoreService,
    StatusService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
