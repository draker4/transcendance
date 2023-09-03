/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './service/two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './controller/two-factor-authentication.controller';
import { UsersService } from '@/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/utils/typeorm/User.entity';
import { Channel } from 'diagnostics_channel';
import { Token } from '@/utils/typeorm/Token.entity';
import { CryptoService } from '@/utils/crypto/crypto';
import { MailService } from '@/mail/mail.service';
import { AuthService } from '@/auth/services/auth.service';
import { AvatarService } from '@/avatar/service/avatar.service';
import { JwtService } from '@nestjs/jwt';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementData,
      User,
      Channel,
      Token,
      Avatar,
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
  providers: [
    AchievementService,
    TwoFactorAuthenticationService,
    UsersService,
    CryptoService,
    MailService,
    JwtService,
    AuthService,
    AvatarService,
    ChannelService,
    StatsService,
    StoryService,
  ],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
