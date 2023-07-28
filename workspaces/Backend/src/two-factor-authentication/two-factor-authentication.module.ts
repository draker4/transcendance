/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { UsersService } from '@/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/utils/typeorm/User.entity';
import { Channel } from 'diagnostics_channel';
import { Token } from '@/utils/typeorm/Token.entity';
import { CryptoService } from '@/utils/crypto/crypto';
import { MailService } from '@/mail/mail.service';
import { AuthService } from '@/auth/services/auth.service';
import { AvatarService } from '@/avatar/avatar.service';
import { JwtService } from '@nestjs/jwt';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Channel,
    Token,
    Avatar,
    UserChannelRelation,
  ])],
  providers: [
    TwoFactorAuthenticationService,
    UsersService,
    CryptoService,
    MailService,
    JwtService,
    AuthService,
    AvatarService,
    ChannelService,
  ],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
