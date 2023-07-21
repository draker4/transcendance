// import standard package froms nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import entities
import { Game } from 'src/utils/typeorm/Game.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { Score } from '@/utils/typeorm/Score.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { UsersService } from '@/users/users.service';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';

@Injectable()
export class GameService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //
  constructor(
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
    @InjectRepository(Score)
    private readonly ScoreRepository: Repository<Score>,
    @InjectRepository(Stats)
    private readonly StatsRepository: Repository<Stats>,

    private readonly usersService: UsersService,
    private readonly scoreService: ScoreService,
    private readonly statsService: StatsService,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async getGameData(gameId: string): Promise<any> {
    try {
      const game = await this.GameRepository.find({ where: { uuid: gameId } });
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //
}
