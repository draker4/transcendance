import { Injectable } from '@nestjs/common';
import { LobbyUtils } from './lobbyUtils';
import { GameInfo } from 'src/utils/types/game.types';

@Injectable()
export class LobbyService extends LobbyUtils {
  async CreateGame(req: any): Promise<any> {
    try {
      //Si le joueur est déjà dans une partie
      if (await this.CheckIfAlreadyInGame(req.user.id)) {
        const Data = {
          success: false,
          message: 'You are already in a game',
        };
        return Data;
      }

      //Si le joueur recherche deja une partie
      if (await this.CheckIfAlreadyInMatchmaking(req.user.id)) {
        const Data = {
          success: false,
          message: 'You are already in matchmaking',
        };
        return Data;
      }

      //Creer une game
      const game_id = await this.CreateGameInDB(
        req.user.id,
        req.body.name,
        req.body.maxPoint,
        req.body.maxRound,
        req.body.difficulty,
        req.body.push,
        req.body.hostSide,
        req.body.background,
        req.body.ball,
        req.body.type,
      );

      const Data = {
        success: true,
        message: 'Game created',
        data: {
          id: game_id,
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

  async GetAll(req: any): Promise<any> {
    try {
      //Renvoi toutes les games Waiting ou Playing
      const games = await this.GameRepository.find({
        where: { status: 'Waiting' || 'Playing' },
      });
      //Clean les infos
      const gamesInfos: GameInfo[] = [];
      for (let i = 0; i < games.length; i++) {
        const hostLogin = await this.GetPlayerName(games[i].host);
        const opponentLogin = await this.GetPlayerName(games[i].opponent);
        const gameInfo: GameInfo = {
          uuid: games[i].uuid,
          name: games[i].name,
          hostName: hostLogin,
          opponentName: opponentLogin,
          status: games[i].status,
          result: games[i].result,
          actualRound: games[i].actualRound,
          maxPoint: games[i].maxPoint,
          maxRound: games[i].maxRound,
          hostSide: games[i].hostSide,
          difficulty: games[i].difficulty,
          push: games[i].push,
          background: games[i].background,
          ball: games[i].ball,
          type: games[i].type,
        };
        gamesInfos.push(gameInfo);
      }

      const Data = {
        success: true,
        message: 'Request successfulld',
        data: gamesInfos,
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

  async GetGameById(id: string, req: any): Promise<any> {
    try {
      //Si il manque des datas
      if (id == null) {
        const Data = {
          success: false,
          message: 'Not enough parameters',
        };
        return Data;
      }

      //Si la partie existe pas
      if (!(await this.CheckIfGameExist(id))) {
        const Data = {
          success: false,
          message: "Game doesn't exist",
        };
        return Data;
      }

      //Si le joueur est pas dans cette partie
      if (!(await this.CheckIfPlayerIsAlreadyInThisGame(id, req.user.id))) {
        const Data = {
          success: false,
          message: 'You are not in this game',
        };
        return Data;
      }

      //Renvoi la game
      const game = await this.GameRepository.findOne({
        where: { uuid: id },
      });
      const hostLogin = await this.GetPlayerName(game.host);
      const opponentLogin = await this.GetPlayerName(game.opponent);
      const gameInfo: GameInfo = {
        uuid: game.uuid,
        name: game.name,
        hostName: hostLogin,
        opponentName: opponentLogin,
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
        data: gameInfo,
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

      //Retire le joueur de toutes les game ou il est ( si game en Waiting ou Playing )
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
