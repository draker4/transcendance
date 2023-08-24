import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ValidationSchema } from './validation.schema';
import { MailModule } from './mail/mail.module';

import { LobbyModule } from './lobby/lobby.module';
import { Game } from './utils/typeorm/Game.entity';

import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { Matchmaking } from './utils/typeorm/Matchmaking.entity';

import { UsersModule } from './users/users.module';
import { User } from './utils/typeorm/User.entity';
import { Avatar } from './utils/typeorm/Avatar.entity';
import { AvatarModule } from './avatar/avatar.module';
import { ChatModule } from './chat/chat.module';
import { Channel } from './utils/typeorm/Channel.entity';
import { ChannelModule } from './channels/channel.module';
import { GameModule } from './game/game.module';
import { Training } from './utils/typeorm/Training.entity';
import { TrainingModule } from './training/training.module';
import { UserChannelRelation } from './utils/typeorm/UserChannelRelation';
import { UserPongieRelation } from './utils/typeorm/UserPongieRelation';
import { Score } from './utils/typeorm/Score.entity';
import { Message } from './utils/typeorm/Message.entity';
import { MessageModule } from './messages/messages.module';
import { Token } from './utils/typeorm/Token.entity';
import { StatsModule } from './stats/stats.module';
import { Stats } from './utils/typeorm/Stats.entity';
import { ScoreModule } from './score/score.module';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { BackupCode } from './utils/typeorm/BackupCode.entity';
import { SocketToken } from './utils/typeorm/SocketToken.entity';
import { Notif } from './utils/typeorm/Notif.entity';
import { NotifMessages } from './utils/typeorm/NotifMessages.entity';
import { Image } from './utils/typeorm/Image.entity';

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
      entities: [
        User,
        Game,
        Matchmaking,
        Avatar,
        Channel,
        Message,
        Score,
        Stats,
        Training,
        UserChannelRelation,
        UserPongieRelation,
        Token,
        BackupCode,
        SocketToken,
        Notif,
        NotifMessages,
        Image,
      ],
      synchronize: true,
    }),
    AuthModule,
    AvatarModule,
    ChannelModule,
    ChatModule,
    GameModule,
    MailModule,
    LobbyModule,
    MatchmakingModule,
    StatsModule,
    TrainingModule,
    MessageModule,
    UsersModule,
    ScoreModule,
    TwoFactorAuthenticationModule,
  ],
})
export class AppModule {}
