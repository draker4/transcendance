import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './service/game.service';
import { GameGateway } from './gateway/game.gateway';
import { User } from 'src/utils/typeorm/User.entity';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { Score } from 'src/utils/typeorm/Score.entity';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';
import { GameManager } from './class/GameManager';
import { Pong } from './class/Pong';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Matchmaking, User, Score])],
  providers: [GameGateway, GameService, LobbyService, GameManager, Pong],
})
export class GameModule {}
