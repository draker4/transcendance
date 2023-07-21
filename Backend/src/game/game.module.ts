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

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Score, Stats, User, Channel, Token]),
  ],
  providers: [
    GameGateway,
    GameService,
    GameManager,
    Pong,
    ScoreService,
    StatsService,
    UsersService,
    CryptoService,
  ],
})
export class GameModule {}
