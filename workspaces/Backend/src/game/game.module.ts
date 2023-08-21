// import standard nest packages
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// import entities
import { Game } from 'src/utils/typeorm/Game.entity';
import { Score } from 'src/utils/typeorm/Score.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';

// import game providers
import { GameGateway } from './gateway/game.gateway';
import { GameManager } from './class/GameManager';
import { Pong } from './class/Pong';

// import external services
import { GameService } from './service/game.service';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';
import { UsersService } from '@/users/users.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { ColoredLogger } from './colored-logger';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { AvatarService } from '@/avatar/avatar.service';
import { ChannelService } from '@/channels/channel.service';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { StatusService } from '@/statusService/status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Avatar,
      BackupCode,
      Channel,
      Game,
      Score,
      Stats,
      Token,
      User,
      UserChannelRelation,
      SocketToken,
      Notif,
    ]),
  ],
  providers: [
    AvatarService,
    ChannelService,
    ColoredLogger,
    CryptoService,
    GameGateway,
    GameService,
    GameManager,
    Pong,
    ScoreService,
    StatsService,
    UsersService,
    StatusService,
  ],
})
export class GameModule {}
