import { Injectable } from '@nestjs/common';
import { LobbyUtils } from './lobbyUtils';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';

@Injectable()
export class LobbyService extends LobbyUtils {
  @InjectRepository(Game)
  public readonly gameRepository: Repository<Game>;

  async CreateGame(userId: number, game: CreateGameDTO): Promise<any> {
    try {
      //Si le joueur est déjà dans une partie
      if (await this.checkIfAlreadyInGame(userId)) {
        const Data = {
          success: false,
          message: 'You are already in a game',
        };
        return Data;
      }

      //Si le joueur recherche deja une partie
      if (await this.CheckIfAlreadyInMatchmaking(userId)) {
        const Data = {
          success: false,
          message: 'You are already in matchmaking',
        };
        return Data;
      }

      const newGame: Game = this.gameRepository.create(game);
      newGame.createdAt = new Date();
      await this.gameRepository.save(newGame);

      const Data = {
        success: true,
        message: 'Game created',
        data: {
          id: newGame.id,
        },
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

  async JoinGame(req: any): Promise<any> {
    try {
      //Si il manque des datas
      if (req.body.join_as == null || req.body.game_id == null) {
        const Data = {
          success: false,
          message: 'Not enough parameters',
        };
        return Data;
      }

      //Si la partie existe pas
      if (!(await this.CheckIfGameExist(req.body.game_id))) {
        const Data = {
          success: false,
          message: "Game doesn't exist",
        };
        return Data;
      }

      //Si le joueur est deja dans cette partie
      if (
        await this.CheckIfPlayerIsAlreadyInThisGame(
          req.body.game_id,
          req.user.id,
        )
      ) {
        const Data = {
          success: true,
          message: 'You are already in this game',
        };
        return Data;
      }

      //Si deja un oposant et qu'il join en opponent (2 joueurs max)
      if (
        req.body.join_as == 'opponent' &&
        (await this.CheckIfGameHasOpponent(req.body.game_id))
      ) {
        const Data = {
          success: false,
          message: 'Game already has an opponent',
        };
        return Data;
      }

      //Ajoute le joueur dans la game en opponent
      if (
        req.body.join_as == 'opponent' &&
        (await this.AddPlayerToGame(req.body.game_id, req.user.id))
      ) {
        const Data = {
          success: true,
          message: 'You joined the game as an opponent',
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

  async GetAll(): Promise<any> {
    try {
      //Renvoi toutes les games Waiting ou Playing
      const games = await this.gameRepository.find({
        where: { status: 'Not Started' || 'Stopped' || 'Playing' },
      });
      //Clean les infos
      // const gamesInfos: GameData[] = [];
      // for (let i = 0; i < games.length; i++) {
      //   const hostLogin = await this.GetPlayerName(games[i].host);
      //   const opponentLogin = await this.GetPlayerName(games[i].opponent);
      //   const gameInfo: GameData = {
      //     id: games[i].id,
      //     name: games[i].name,
      //     host: games[i].host,
      //     hostName: hostLogin,
      //     opponent: games[i].opponent,
      //     opponentName: opponentLogin,
      //     status: games[i].status,
      //     result: games[i].result,
      //     actualRound: games[i].actualRound,
      //     maxPoint: games[i].maxPoint,
      //     maxRound: games[i].maxRound,
      //     hostSide: games[i].hostSide,
      //     difficulty: games[i].difficulty,
      //     push: games[i].push,
      //     background: games[i].background,
      //     ball: games[i].ball,
      //     type: games[i].type,
      //   };
      //   gamesInfos.push(gameInfo);
      // }

      // const Data = {
      //   success: true,
      //   message: 'Request successfulld',
      //   data: gamesInfos,
      // };
      // return Data;
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }
  }

  async accessGame(gameId: string, userId: number): Promise<ReturnData> {
    const data: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      //Si il manque des datas
      if (gameId == null || userId == null) {
        data.message = 'Not enough parameters';
        return data;
      }
      //Retrouver la partie et confirmer si player ou spectator
      const game: Game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (!game) {
        data.message = 'Game not found';
        return data;
      }
      data.success = true;
      if (game.host == userId || game.opponent == userId) {
        data.message = 'User will join as player';
      } else {
        data.message = 'User will join as spectator';
      }
      return data;
    } catch (error) {
      data.error = error;
      return data;
    }
  }

  async Quit(userId: number): Promise<any> {
    const data: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    if (userId == null) {
      data.message = 'Not enough parameters';
      return data;
    }
    try {
      //Regarde is le joueur est dans une game
      if (!(await this.checkIfAlreadyInGame(userId))) {
        data.message = 'You are not in a game';
        return data;
      }
      //Retire le joueur de toutes les game ou il est ( si game en Waiting ou Playing )
      if (await this.RemovePlayerFromAllGames(userId)) {
        data.success = true;
        data.message = 'You have been removed from all game';
      }
      return data;
    } catch (error) {
      return data;
    }
  }

  //Si le joueur est en game renvoi "In game" et l'id de la game, si le joueur en Matchmaking le retire de la liste
  async IsInGame(userId: number): Promise<any> {
    const data: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      //Si le joueur est en matchmaking le retire de la liste
      if (await this.CheckIfAlreadyInMatchmaking(userId)) {
        await this.RemovePlayerFromMatchmaking(userId);
      }

      //Si il est dans une game recupere son id
      data.data = await this.getGameId(userId);
      if (data.data) {
        data.success = true;
        data.message = 'You are in a game';
        return data;
      } else {
        data.success = false;
        data.message = 'You are not in a game';
        return data;
      }
    } catch (error) {
      data.error = error;
      return data;
    }
  }
}
