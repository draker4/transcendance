import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './service/game.service';
import { GameGateway } from './gateway/game.gateway';
import { User } from 'src/utils/typeorm/User.entity';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { Score } from 'src/utils/typeorm/Score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Matchmaking, User, Score])],

  providers: [GameGateway, GameService],
})
export class GameModule {}
