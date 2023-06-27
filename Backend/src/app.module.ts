import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ValidationSchema } from './validation.schema';
import { MailModule } from './mail/mail.module';

import { GamesModule } from './games/games.module';
import { Game } from './utils/typeorm/Game.entity';
import { Matchmaking } from './utils/typeorm/Matchmaking.entity';

import { UsersModule } from './users/users.module';
import { User } from './utils/typeorm/User.entity';
import { Avatar } from './utils/typeorm/Avatar.entity';
import { AvatarModule } from './avatar/avatar.module';
import { GatewayModule } from './gateway/gateway.module';
import { Channel } from './utils/typeorm/Channel.entity';
import { ChannelModule } from './channels/channel.module';

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
      entities: [User, Game, Matchmaking, Avatar, Channel],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    GamesModule,
    AvatarModule,
    GatewayModule,
    ChannelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
