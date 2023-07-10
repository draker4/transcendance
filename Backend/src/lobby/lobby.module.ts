import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { LobbyService } from './lobby-service/lobby.service';
import { LobbyController } from './lobby-controller/lobby.controller';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([Matchmaking]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
})
export class LobbyModule {}
