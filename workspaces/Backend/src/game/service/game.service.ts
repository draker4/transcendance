// import standard package froms nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

// import entities
import { Game } from 'src/utils/typeorm/Game.entity';
import { UsersService } from '@/users/users.service';
import { AvatarService } from '@/avatar/avatar.service';

// import Pong game logic
import { Player } from '@transcendence/shared/types/Game.types';
import { convertColor } from '@transcendence/shared/game/pongUtils';
import { CreateGameDTO } from '../dto/CreateGame.dto';
import { Score } from '@/utils/typeorm/Score.entity';

import { ScoreService } from '@/score/service/score.service';
import { CreateScoreDTO } from '@/score/dto/CreateScore.dto';

@Injectable()
export class GameService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    private readonly scoreService: ScoreService,
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async getGameById(gameId: string): Promise<any> {
    try {
      console.log('getGameById: ', gameId);
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        console.log('getGameById: Game not found');
        throw new Error('Game not found');
      }
      console.log('getGameById: ', game);
      return game;
    } catch (error) {
      console.log('getGameById: ', error.message);
      throw new Error(error.message);
    }
  }

  async getGameByUserId(userId: number): Promise<any> {
    try {
      let game = await this.gameRepository.findOne({
        where: {
          host: userId,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (game != null) {
        return game.id;
      }
      game = await this.gameRepository.findOne({
        where: {
          opponent: userId,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (game != null) {
        return game.id;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getCurrentGames(): Promise<Game[]> {
    try {
      const games = await this.gameRepository.find({
        where: { status: 'Not Started' || 'Stopped' || 'Playing' },
      });
      return games;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async definePlayer(
    userId: number,
    side: 'Left' | 'Right',
  ): Promise<Player> {
    try {
      let player: Player = {
        id: -1,
        name: 'Searching Player',
        color: { r: 0, g: 0, b: 0, a: 0 },
        avatar: {
          image: '',
          text: '',
          variant: 'circular',
          borderColor: '#000000',
          backgroundColor: '#ffffff',
          empty: true,
          decrypt: false,
        },
        side: side,
      };
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        return player;
      }
      const avatar = await this.avatarService.getAvatarById(userId, false);
      if (!avatar) {
        player.id = user.id;
        player.name = user.login;
        player.side = side;
        return player;
      }
      player = {
        id: userId,
        name: user.login,
        color: convertColor(avatar.borderColor),
        avatar: avatar,
        side: side,
      };
      return player;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  public async checkOpponent(gameId: string): Promise<number> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new WsException('Game not found');
      }
      return game.opponent;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  public async createGame(game: CreateGameDTO): Promise<any> {
    try {
      const newGame: Game = this.gameRepository.create(game);
      newGame.createdAt = new Date();
      await this.gameRepository.save(newGame);
      const newScore: CreateScoreDTO = {
        gameId: newGame.id,
        mode: newGame.mode,
        leftPlayerId:
          newGame.hostSide == 'Left' ? newGame.host : newGame.opponent,
        rightPlayerId:
          newGame.hostSide == 'Right' ? newGame.host : newGame.opponent,
      };
      const score = await this.scoreService.createScore(newScore);
      await this.updateGameScore(newGame, score);
      return newGame.id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async addOpponent(gameId: string, opponentId: number): Promise<any> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new Error('Game not found');
      }
      game.opponent = opponentId;
      await this.gameRepository.save(game);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async quitGame(gameId: string, userId): Promise<any> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        throw new Error('Game not found');
      }
      if (game.status === 'Playing' || game.status === 'Stopped') {
        game.status = 'Deleted';
        if (userId === game.host) {
          game.result = 'Opponent';
        } else if (userId === game.opponent) {
          game.result = 'Host';
        } else {
          throw new Error('User not in game');
        }
      } else if (game.status === 'Not Started') {
        game.status = 'Deleted';
        game.result = 'Deleted';
      } else {
        throw new Error('Game already finnished');
      }
      await this.gameRepository.save(game);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async updateGameScore(game: Game, score: Score) {
    await this.gameRepository
      .createQueryBuilder()
      .relation(Game, 'score')
      .of(game.id)
      .set(score);
  }
}
