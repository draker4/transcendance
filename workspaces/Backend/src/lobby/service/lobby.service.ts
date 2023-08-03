import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';

import { GameService } from '@/game/service/game.service';
import { UsersService } from '@/users/users.service';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { ScoreService } from '@/score/service/score.service';

import { GameInfo, Player } from '@transcendence/shared/types/Game.types';

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(Game)
    public readonly gameRepository: Repository<Game>,

    public readonly gameService: GameService,
    public readonly userService: UsersService,
    public readonly matchmakingService: MatchmakingService,
    public readonly scoreService: ScoreService,
  ) {}
  async CreateGame(
    userId: number,
    newGame: CreateGameDTO,
  ): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const gameId = await this.gameService.getGameByUserId(userId);
      if (gameId) {
        ret.message = 'You are already in a game';
        ret.data = gameId;
        return ret;
      }

      //Si le joueur recherche deja une partie
      else if (
        await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)
      ) {
        ret.message = 'You are already in matchmaking';
        return ret;
      }

      const newGameId = await this.gameService.createGame(newGame);
      ret.success = true;
      ret.message = 'Game created';
      ret.data = newGameId;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  async JoinGame(userId: number, gameId: string): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        ret.message = 'User not found';
        return ret;
      }

      const game: Game = await this.gameService.getGameById(gameId);
      if (!game) {
        ret.message = 'Game not found';
        return ret;
      }

      //Si le joueur est deja dans cette partie
      if (game.host === userId || game.opponent === userId) {
        ret.success = true;
        ret.message = 'You are already in this game';
        return ret;
      }

      //Si deja un oposant et qu'il join en opponent (2 joueurs max)
      if (game.opponent !== -1) {
        ret.message = 'Game is full';
        return ret;
      }
      //Ajoute le joueur dans la game en opponent
      await this.gameService.addOpponent(gameId, userId);
      ret.success = true;
      ret.message = 'You joined the game as an opponent';
      ret.data = gameId;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  async GetAll(mode?: 'League' | 'Party'): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const games = await this.gameService.getCurrentGames();
      if (!games) {
        ret.message = 'No games found';
        return ret;
      }
      const gamesInfos: GameInfo[] = [];
      for (const game of games) {
        if (mode && game.mode !== mode) continue;
        const leftPlayer: Player = await this.gameService.definePlayer(
          game.hostSide === 'Left' ? game.host : game.opponent,
          'Left',
          game.hostSide === 'Left',
        );
        const rightPlayer: Player = await this.gameService.definePlayer(
          game.hostSide === 'Right' ? game.host : game.opponent,
          'Right',
          game.hostSide === 'Right',
        );
        const gameInfo: GameInfo = {
          id: game.id,
          name: game.name,
          type: game.type,
          mode: game.mode,
          leftPlayer: leftPlayer,
          rightPlayer: rightPlayer,
          actualRound: game.actualRound,
          maxRound: game.maxRound,
          status: game.status,
        };
        gamesInfos.push(gameInfo);
      }
      ret.success = true;
      ret.message = 'Games found';
      ret.data = gamesInfos;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  async Quit(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const gameId = await this.gameService.getGameByUserId(userId);
      if (!gameId) {
        ret.message = 'You are already not in a game';
        return ret;
      }
      await this.gameService.quitGame(gameId, userId);
      ret.success = true;
      ret.message = 'You quit the game';
      return ret;
    } catch (error) {
      return ret;
    }
  }

  //Si le joueur est en game renvoie l'id, si le joueur en Matchmaking le retire de la liste
  async IsInGame(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      //Si le joueur est en matchmaking le retire de la liste
      if (await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)) {
        await this.matchmakingService.RemovePlayerFromMatchmaking(userId);
      }

      //Si il est dans une game recupere son id
      const gameId = await this.gameService.getGameByUserId(userId);
      if (!gameId) {
        ret.message = 'You are not in a game';
        return ret;
      }
      ret.success = true;
      ret.message = 'You are in a game';
      ret.data = gameId;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }
}
