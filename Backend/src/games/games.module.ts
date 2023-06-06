import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { GamesService } from './games-service/games-service.service';
import { GamesController } from './games-controller/games-controller.controller';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), TypeOrmModule.forFeature([Matchmaking])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService]
})
export class GamesModule {};
