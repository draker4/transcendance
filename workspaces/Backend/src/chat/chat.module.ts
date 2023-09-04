/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from './guard/wsJwt.guard';
import { UsersService } from 'src/users/service/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { ChatService } from './chat.service';
import { ChannelService } from 'src/channels/channel.service';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UserPongieRelation } from 'src/utils/typeorm/UserPongieRelation';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { MessagesService } from 'src/messages/messages.service';
import { Message } from 'src/utils/typeorm/Message.entity';
import { ChannelAuthGuard } from './guard/channelAuthGuard';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { NotifMessages } from '@/utils/typeorm/NotifMessages.entity';
import { StatsService } from '@/stats/service/stats.service';
import { Image } from '@/utils/typeorm/Image.entity';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { StoryService } from '@/story/service/story.service';
import { StatusModule } from '@/statusService/status.module';
import { Matchmaking } from '@/utils/typeorm/Matchmaking.entity';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { Game } from '@/utils/typeorm/Game.entity';
import { GameService } from '@/game/service/game.service';
import { Score } from '@/utils/typeorm/Score.entity';
import { ScoreService } from '@/score/service/score.service';
import { AvatarService } from '@/avatar/service/avatar.service';
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
      Avatar,
      UserPongieRelation,
      UserChannelRelation,
      Message,
      Token,
      BackupCode,
      SocketToken,
      Stats,
      Notif,
      NotifMessages,
      Image,
      Story,
      StoryData,
      Matchmaking,
      Game,
      Score,
      Avatar,
    ]),
    StatusModule,
  ],
  providers: [
    AchievementService,
    ChatGateway,
    WsJwtGuard,
    ChannelAuthGuard,
    UsersService,
    CryptoService,
    ChatService,
    ChannelService,
    MessagesService,
    StatsService,
    StoryService,
    MatchmakingService,
    GameService,
    ScoreService,
    AvatarService,
  ],
})
export class ChatModule {}
