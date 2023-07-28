// import standard package froms nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

// import entities
import { Game } from 'src/utils/typeorm/Game.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { Score } from '@/utils/typeorm/Score.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { UsersService } from '@/users/users.service';
import { ScoreService } from '@/score/service/score.service';
import { StatsService } from '@/stats/service/stats.service';

// import types
import { Player, RGB } from '@transcendence/shared/types/Game.types';

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
      const game = await this.GameRepository.findOne({
        where: { uuid: gameId },
      });
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async definePlayer(
    userId: number,
    usersService: UsersService,
    side: 'Left' | 'Right',
  ): Promise<Player> {
    try {
      const user = await usersService.getUserById(userId);
      const avatar = await usersService.getUserAvatar(userId);
      const player: Player = {
        id: userId,
        name: user.login,
        color: this.convertColor(avatar.avatar.backgroundColor),
        side: side,
      };
      return player;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  public async checkOpponent(gameId: string): Promise<number> {
    try {
      const game = await this.GameRepository.findOne({
        where: { uuid: gameId },
      });
      if (!game) {
        throw new WsException('Game not found');
      }
      return game.opponent;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private convertColor(hexaColor: string): RGB {
    const r = parseInt(hexaColor.slice(1, 3), 16);
    const g = parseInt(hexaColor.slice(3, 5), 16);
    const b = parseInt(hexaColor.slice(5, 7), 16);

    const rgb: RGB = { r, g, b };
    return rgb;
  }
}
