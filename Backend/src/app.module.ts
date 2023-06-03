import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ValidationSchema } from './validation.schema';
import { MailModule } from './mail/mail.module';

import { GamesModule } from './games/games.module';
import { Game } from './typeorm/Game.entity';

import { UsersModule } from './users/users.module';
import { User } from './typeorm/User.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: ValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATA_BASE_HOST,
      port: parseInt(process.env.DATA_BASE_PORT),
      username: process.env.DATA_BASE_USER,
      password: process.env.DATA_BASE_PASSWORD,
      database: process.env.DATA_BASE_NAME,
      entities: [User, Game],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    GamesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
