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

@Injectable()
export class GameService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //
  constructor(
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,

    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
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
      const user = await this.usersService.getUserById(userId);
      const avatar = await this.avatarService.getAvatarById(userId, false);
      const player: Player = {
        id: userId,
        name: user.login,
        color: convertColor(avatar.backgroundColor),
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
}
