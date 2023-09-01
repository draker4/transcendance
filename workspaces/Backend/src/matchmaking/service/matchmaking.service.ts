import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import StartMatchmakingDTO from '../dto/StartMatchmaking.dto';
import CreateMatchmakingDTO from '../dto/CreateMatchmaking.dto';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

import { CreateGameDTO } from '@/game/dto/CreateGame.dto';
import { GameService } from '@/game/service/game.service';
import {
  confirmBackground,
  confirmBall,
} from '@transcendence/shared/game/random';

@Injectable()
export class MatchmakingService {
  constructor(
    @InjectRepository(Matchmaking)
    private readonly matchmakingRepository: Repository<Matchmaking>,

    private readonly gameService: GameService,
  ) {}

  public async createMatchmaking(
    create: CreateMatchmakingDTO,
  ): Promise<Matchmaking> {
    const matchmaking = new Matchmaking();
    matchmaking.userId = create.userId;
    return this.matchmakingRepository.save(matchmaking);
  }

  public async startSearch(
    userId: number,
    search: StartMatchmakingDTO,
  ): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      let matchmaking = await this.matchmakingRepository.findOne({
        where: { userId: userId },
      });
      if (!matchmaking) {
        this.createMatchmaking({ userId: userId });
        matchmaking = await this.matchmakingRepository.findOne({
          where: { userId: userId },
        });
      }
      matchmaking.searching = true;
      matchmaking.type = search.type;
      await this.matchmakingRepository.save(matchmaking);

      ret.success = true;
      ret.message = 'You are now in matchmaking ';
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  public async stopSearch(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const matchmaking = await this.matchmakingRepository.findOne({
        where: { userId: userId },
      });
      matchmaking.searching = false;
      await this.matchmakingRepository.save(matchmaking);

      ret.success = true;
      ret.message = 'You are no longer in matchmaking ';
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  public async checkSearch(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const gameId = await this.gameService.getGameByUserId(userId);
      if (gameId) {
        ret.success = true;
        ret.message = 'You are in game';
        ret.data = gameId;
        return ret;
      }

      const search = await this.matchmakingRepository.findOne({
        where: { userId: userId },
      });
      if (search.searching == false) {
        ret.success = true;
        ret.message = 'You are not in matchmaking';
        return ret;
      }

      //check autre joueur en matchmaking
      const sameSearch = await this.matchmakingRepository.find({
        where: { searching: true, type: search.type, userId: Not(userId) },
      });

      if (sameSearch.length > 0) {
        sameSearch.sort(
          (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
        );
        this.stopSearch(sameSearch[0].userId);
        this.stopSearch(userId);
        const game: CreateGameDTO = {
          name: `${search.userId} vs ${sameSearch[0].userId}`,
          type: search.type,
          mode: 'League',
          host: search.userId,
          opponent: sameSearch[0].userId,
          hostSide: 'Left',
          maxPoint:
            search.type == 'Classic' ? 9 : search.type == 'Best3' ? 7 : 5,
          maxRound:
            search.type == 'Classic' ? 1 : search.type == 'Best3' ? 3 : 5,
          difficulty: 2,
          push: search.type == 'Classic' ? false : true,
          pause: search.type == 'Classic' ? false : true,
          background:
            search.type == 'Classic' ? 'classic' : confirmBackground('Random'),
          ball: search.type == 'Classic' ? 'classic' : confirmBall('Random'),
        };
        const gameId = await this.gameService.createGame(game);
        ret.success = true;
        ret.message = 'Game created';
        ret.data = gameId;
      } else {
        ret.success = false;
        ret.message = 'No match found';
      }
      return ret;
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }
  }
}
