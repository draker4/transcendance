import { Injectable } from '@nestjs/common';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';
import { LobbyUtils } from 'src/lobby/lobby-service/lobbyUtils';
import { GameData } from 'src/utils/types/game.types';

@Injectable()
export class GameService extends LobbyUtils {
  // @InjectRepository(User)
  // private readonly userRepository: Repository<User>;
  // @InjectRepository(Game)
  // private readonly gameRepository: Repository<Game>;
  // private readonly usersService: UsersService;

  private readonly lobbyService: LobbyService;

  async GetGameData(gameId: string, userId: number): Promise<any> {
    try {
      //Si il manque des datas
      if (gameId == null) {
        const Data = {
          success: false,
          message: 'Not enough parameters',
        };
        return Data;
      }

      //Si la partie existe pas
      if (!(await this.CheckIfGameExist(gameId))) {
        const Data = {
          success: false,
          message: "Game doesn't exist",
        };
        return Data;
      }

      //Si le joueur est pas dans cette partie
      if (!(await this.CheckIfPlayerIsAlreadyInThisGame(gameId, userId))) {
        const Data = {
          success: false,
          message: 'You are not in this game',
        };
        return Data;
      }

      //Renvoi la game
      const game = await this.GameRepository.findOne({
        where: { uuid: gameId },
      });
      const gameData: GameData = {
        uuid: game.uuid,
        name: game.name,
        host: game.host,
        opponent: game.opponent,
        status: game.status,
        result: game.result,
        actualRound: game.actualRound,
        maxPoint: game.maxPoint,
        maxRound: game.maxRound,
        hostSide: game.hostSide,
        difficulty: game.difficulty,
        push: game.push,
        background: game.background,
        ball: game.ball,
        type: game.type,
      };

      const Data = {
        success: true,
        message: 'Request successfulld',
        data: gameData,
      };
      return Data;
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }
  }

  async Quit(req: any): Promise<any> {
    try {
      //Regarde is le joueur est dans une game
      if (!(await this.CheckIfAlreadyInGame(req.user.id))) {
        const Data = {
          success: false,
          message: 'You are not in a game',
        };
        return Data;
      }

      //Retire le joueur de toutes les game ou il est ( si game en Waiting ou InProgress )
      if (await this.RemovePlayerFromAllGames(req.user.id)) {
        const Data = {
          success: true,
          message: 'You have been removed from all game',
        };
        return Data;
      }
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }

    const Data = {
      success: false,
      message: 'Case not handled',
    };
    return Data;
  }

  //Si le joueur est en game renvoi "In game" et l'id de la game, si le joueur en Matchmaking le retire de la liste
  async IsInGame(req: any): Promise<any> {
    try {
      //Si le joueur est en matchmaking le retire de la liste
      if (await this.CheckIfAlreadyInMatchmaking(req.user.id)) {
        await this.RemovePlayerFromMatchmaking(req.user.id);
      }

      //Si il est dans une game recupere son id
      if (await this.CheckIfAlreadyInGame(req.user.id)) {
        const game = await this.GetGameId(req.user.id);
        const Data = {
          success: true,
          message: 'You are in a game',
          data: {
            id: game.uuid,
          },
        };
        return Data;
      } else {
        const Data = {
          success: false,
          message: 'You are not in a game',
        };
        return Data;
      }
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
