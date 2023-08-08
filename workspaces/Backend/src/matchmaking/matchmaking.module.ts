import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchmakingService } from './service/matchmaking.service';
import { MatchmakingController } from './controller/matchmaking.controller';

import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { GameService } from '@/game/service/game.service';
import { ScoreService } from '@/score/service/score.service';
import { Score } from '@/utils/typeorm/Score.entity';
import { UsersService } from '@/users/users.service';
import { AvatarService } from '@/avatar/avatar.service';
import { Channel } from '@/utils/typeorm/Channel.entity';
import { Token } from '@/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { CryptoService } from '@/utils/crypto/crypto';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { ChannelService } from '@/channels/channel.service';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { StatsService } from '@/stats/service/stats.service';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avatar,
      BackupCode,
      Channel,
      Game,
      Matchmaking,
      Score,
      Stats,
      Token,
      User,
      UserChannelRelation,
      SocketToken,
      Notif,
    ]),
  ],
  controllers: [MatchmakingController],
  providers: [
    AvatarService,
    ChannelService,
    CryptoService,
    GameService,
    MatchmakingService,
    ScoreService,
    StatsService,
    UsersService,
  ],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
