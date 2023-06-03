import { Module } from '@nestjs/common';
import { GamesService } from './games-service/games-service.service';

@Module({
  providers: [GamesService]
})
export class GamesModule {}
