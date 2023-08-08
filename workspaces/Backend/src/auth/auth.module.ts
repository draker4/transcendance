import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
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
import { AvatarService } from 'src/avatar/avatar.service';
import { LocalStrategy } from './strategies/local.strategy';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { ChannelService } from 'src/channels/channel.service';
import { AuthService } from './services/auth.service';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { JwtRefreshStrategy } from './strategies/jwtRefresh.strategy';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Notif } from '@/utils/typeorm/Notif.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([
      User,
      Avatar,
      Channel,
      Token,
      UserChannelRelation,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
    ]),
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    AvatarService,
    ChannelService,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    LocalStrategy,
    CryptoService,
    StatsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
