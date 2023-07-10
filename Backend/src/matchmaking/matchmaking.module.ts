import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchmakingService } from './matchmaking-service/matchmaking.service';
import { MatchmakingController } from './matchmaking-controller/matchmaking.controller';

import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([Matchmaking]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [MatchmakingController],
  providers: [MatchmakingService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
