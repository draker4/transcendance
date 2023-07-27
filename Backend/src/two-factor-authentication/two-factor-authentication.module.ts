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

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Token])],
  providers: [
    TwoFactorAuthenticationService,
    UsersService,
    CryptoService,
    MailService,
  ],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
