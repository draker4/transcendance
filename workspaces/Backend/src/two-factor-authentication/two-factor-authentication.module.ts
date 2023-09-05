/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './service/two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './controller/two-factor-authentication.controller';
import { CryptoService } from '@/utils/crypto/crypto';
import { UsersModule } from '@/users/users.module';
import { MailModule } from '@/mail/mail.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [AuthModule, MailModule, UsersModule],
  providers: [CryptoService, TwoFactorAuthenticationService],
  controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
