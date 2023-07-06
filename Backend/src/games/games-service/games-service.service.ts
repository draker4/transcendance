import { Body, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDTO } from '../dto/Game.dto';
import { Game } from 'src/utils/typeorm/Game.entity';

import { MatchmakingDTO } from '../dto/Matchmaking.dto';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

import { User } from 'src/utils/typeorm/User.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly GameRepository: Repository<Game>,

    @InjectRepository(Matchmaking)
    private readonly MatchMakeRepository: Repository<Matchmaking>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

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
        req.body.push,
        req.body.score,
        req.body.round,
        req.body.difficulty,
        req.body.side,
        req.body.background,
        req.body.ball,
        // req.body.paddle,
        req.body.type,
        // req.body.mode,
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

      //Si la partie est plus en waiting
      if (!(await this.CheckIfGameIsWaiting(req.body.game_id))) {
        const Data = {
          success: false,
          message: 'Game started',
        };
        return Data;
      }

      //Check si la game est deja full viewer ( 5 viewer max )
      if (
        req.body.join_as == 'viewer' &&
        (await this.CheckIfGameHas5Viewers(req.body.game_id))
      ) {
        const Data = {
          success: false,
          message: 'Game already has 5 viewers',
        };
        return Data;
      }

      //Ajoute le joueur dans la game en viewer
      if (
        req.body.join_as == 'viewer' &&
        (await this.AddViewerToGame(req.body.game_id, req.user.id))
      ) {
        const Data = {
          success: true,
          message: 'You joined the game as a viewer',
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
      //Renvoi toutes les games Waiting ou InProgress
      const games = await this.GameRepository.find({
        where: { Status: 'Waiting' || 'InProgress' },
      });
      //Clean les infos
      const games_infos = [];
      for (let i = 0; i < games.length; i++) {
        const Host_Login = await this.GetPlayerName(games[i].Host);
        const Opponent_Login = await this.GetPlayerName(games[i].Opponent);
        const game_info = {
          uuid: games[i].uuid,
          Name: games[i].Name,
          Host: Host_Login,
          Opponent: Opponent_Login,
          Viewers_List: games[i].Viewers_List.length,
          Score_Host: games[i].Score_Host,
          Score_Opponent: games[i].Score_Opponent,
          Status: games[i].Status,
          CreatedAt: games[i].CreatedAt,
          Winner: games[i].Winner,
          Loser: games[i].Loser,
          Score: games[i].Score,
          Push: games[i].Push,
          Round: games[i].Round,
          Difficulty: games[i].Difficulty,
          Side: games[i].Side,
          Background: games[i].Background,
          Ball: games[i].Ball,
          // Paddle: games[i].Paddle,
          Type: games[i].Type,
          // Mode: games[i].Mode,
        };
        games_infos.push(game_info);
      }

      const Data = {
        success: true,
        message: 'Request successfulld',
        data: games_infos,
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

  async GetOne(req: any): Promise<any> {
    try {
      //Si il manque des datas
      if (req.body.game_id == null) {
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

      //Si le joueur est pas dans cette partie
      if (
        !(await this.CheckIfPlayerIsAlreadyInThisGame(
          req.body.game_id,
          req.user.id,
        ))
      ) {
        const Data = {
          success: false,
          message: 'You are not in this game',
        };
        return Data;
      }

      //Renvoi la game
      const game = await this.GameRepository.findOne({
        where: { uuid: req.body.game_id },
      });
      const Host_Login = await this.GetPlayerName(game.Host);
      const Opponent_Login = await this.GetPlayerName(game.Opponent);
      const game_info = {
        uuid: game.uuid,
        Name: game.Name,
        Host: Host_Login,
        Opponent: Opponent_Login,
        Viewers_List: game.Viewers_List.length,
        Score_Host: game.Score_Host,
        Score_Opponent: game.Score_Opponent,
        Status: game.Status,
        CreatedAt: game.CreatedAt,
        Winner: game.Winner,
        Loser: game.Loser,
        Score: game.Score,
        Push: game.Push,
        Round: game.Round,
        Difficulty: game.Difficulty,
        Side: game.Side,
        Background: game.Background,
        Ball: game.Ball,
        // Paddle: game.Paddle,
        Type: game.Type,
        // Mode: game.Mode,
      };

      const Data = {
        success: true,
        message: 'Request successfulld',
        data: game_info,
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
          message: 'You are not in a game anymore',
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

  async MatchmakeStart(req: any): Promise<any> {
    try {
      //Check si le joueur est deja dans une game
      if (await this.CheckIfAlreadyInGame(req.user.id)) {
        const Data = {
          success: false,
          message: 'You are already in a game',
        };
        return Data;
      }

      //Check si le joueur est deja dans la liste de matchmaking
      if (await this.CheckIfAlreadyInMatchmaking(req.user.id)) {
        const Data = {
          success: false,
          message: 'You are already in matchmaking',
        };
        return Data;
      }

      //Ajoute le joueur dans la liste de matchmaking
      if (await this.AddPlayerToMatchmaking(req.user.id)) {
        const Data = {
          success: true,
          message: 'You are now in matchmaking ',
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

  async MatchmakeStop(req: any): Promise<any> {
    try {
      //Check si le joueur est deja dans le matchmaking
      if (!(await this.CheckIfAlreadyInMatchmaking(req.user.id))) {
        const Data = {
          success: false,
          message: 'You are not in matchmaking',
        };
        return Data;
      }

      //Retire le joueur de la liste de matchmaking
      if (await this.RemovePlayerFromMatchmaking(req.user.id)) {
        const Data = {
          success: true,
          message: 'You are not in matchmaking anymore',
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

  async MatchmakeUpdate(req: any): Promise<any> {
    try {
      //Check si le joueur est deja dans une game
      if (await this.CheckIfAlreadyInGame(req.user.id)) {
        const game = await this.GetGameId(req.user.id);
        const Data = {
          success: true,
          message: 'Game found',
          data: {
            id: game.uuid,
            player_waiting: await this.GetNumberOfPlayerInMatchmaking(),
          },
        };
        return Data;
      }

      //Check si le joueur est deja dans le matchmaking
      if (!(await this.CheckIfAlreadyInMatchmaking(req.user.id))) {
        const Data = {
          success: false,
          message: 'You are not in matchmaking ' + req.user.id,
        };
        return Data;
      }

      //Check si deux joueur sont dans la liste de matchmake,  si c'est le cas , fais une game avec les deux et les retire, return le numero de la game creer
      const game_id = await this.CheckIfTwoPlayerAreInMatchmaking();
      if (game_id != false) {
        const Data = {
          success: true,
          message: 'Game created',
          data: {
            id: game_id,
            player_waiting: await this.GetNumberOfPlayerInMatchmaking(),
          },
        };
        return Data;
      }

      const Data = {
        success: true,
        message: 'Waiting for opponent',
        player_waiting: await this.GetNumberOfPlayerInMatchmaking(),
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

  //Renvoi le nombre de joueur en attentes
  async GetStatsLobby(req: any): Promise<any> {
    try {
      const Data = {
        success: true,
        message: 'Request successfulld',
        data: {
          nbWaiting: await this.GetNumberOfPlayerInMatchmaking(),
          nbPlayer: await this.GetNumberOfPlayerConnected(),
          nbGames: await this.GetNumberOfGames(),
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

  //===========================================================Fonction annexe===========================================================

  //Return True si le joueur est dans la liste de matchmaking
  async CheckIfPlayerIsInMatchmaking(user_id: number): Promise<any> {
    if (user_id != null) {
      const user = await this.MatchMakeRepository.findOne({
        where: { Player_Id: user_id },
      });
      if (user != null) {
        return true;
      }
    }
    return false;
  }

  //Ajoute un joueur dans la liste de matchmaking
  async AddPlayerToMatchmaking(user_id: number): Promise<any> {
    //Check si le joueur est deja dans la liste de matchmaking
    if (await this.CheckIfPlayerIsInMatchmaking(user_id)) {
      return false;
    }

    if (user_id != null) {
      const user = new MatchmakingDTO();
      user.Player_Id = user_id;
      user.CreatedAt = new Date();
      await this.MatchMakeRepository.save(user);
      return true;
    }
    return false;
  }

  //Retire un joueur de la liste de matchmaking
  async RemovePlayerFromMatchmaking(user_id: number): Promise<any> {
    if (user_id != null) {
      const user = await this.MatchMakeRepository.findOne({
        where: { Player_Id: user_id },
      });
      if (user != null) {
        await this.MatchMakeRepository.remove(user);
        return true;
      }
    }
    return false;
  }

  //Check si deux joueur sont dans la liste de matchmake,  si c'est le cas , fais une game avec les deux et les retire, return le numero de la game creer
  async CheckIfTwoPlayerAreInMatchmaking(): Promise<any> {
    const all_user = await this.MatchMakeRepository.find();
    if (all_user != null) {
      if (all_user.length >= 2) {
        const user1 = all_user[0];
        const user2 = all_user[1];
        await this.MatchMakeRepository.remove(user1);
        await this.MatchMakeRepository.remove(user2);
        const name_1 = await this.GetPlayerName(user1.Player_Id);
        const name_2 = await this.GetPlayerName(user2.Player_Id);
        const game_id = await this.CreateGameInDB(
          user1.Player_Id,
          name_1 + ' vs ' + name_2,
          false,
          0,
          0,
          0,
          'left',
          '',
          '',
          '',
          // '',
          // '',
        );
        await this.AddPlayerToGame(game_id, user2.Player_Id);
        return game_id;
      }
    }
    return false;
  }

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress"
  async CheckIfAlreadyInGame(user_id: number): Promise<any> {
    if (user_id != null) {
      const host = await this.GameRepository.findOne({
        where: { Host: user_id, Status: 'Waiting' || 'InProgress' },
      });
      if (host != null) {
        return true;
      }
      const opponent = await this.GameRepository.findOne({
        where: { Opponent: user_id, Status: 'Waiting' || 'InProgress' },
      });
      if (opponent != null) {
        return true;
      }
    }
    return false;
  }

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress" et renvoi son id de game
  async GetGameId(user_id: number): Promise<any> {
    if (user_id != null) {
      let game = await this.GameRepository.findOne({
        where: { Host: user_id, Status: 'Waiting' || 'InProgress' },
      });
      if (game != null) {
        return game;
      }
      game = await this.GameRepository.findOne({
        where: { Opponent: user_id, Status: 'Waiting' || 'InProgress' },
      });
      if (game != null) {
        return game;
      }
    }
    return false;
  }

  // Check si le joueur recherche deja une partie
  async CheckIfAlreadyInMatchmaking(user_id: number): Promise<any> {
    if (user_id != null) {
      const user = await this.MatchMakeRepository.findOne({
        where: { Player_Id: user_id },
      });
      if (user != null) {
        return true;
      }
    }
    return false;
  }

  //Creer une game dans la base de donnée
  async CreateGameInDB(
    user_id: number,
    name: string,
    push: boolean,
    score: number,
    round: number,
    difficulty: number,
    side: string,
    background: string,
    ball: string,
    // paddle: string,
    type: string,
    // mode: string,
  ): Promise<any> {
    const gameDTO = new GameDTO();

    gameDTO.uuid = uuidv4();
    gameDTO.Name = name;
    gameDTO.Host = user_id;
    gameDTO.Opponent = -1;
    gameDTO.viewersList = [];
    gameDTO.Score_Host = 0;
    gameDTO.Score_Opponent = 0;
    gameDTO.Status = 'Waiting';
    gameDTO.CreatedAt = new Date().toISOString();
    gameDTO.Winner = -1;
    gameDTO.Loser = -1;
    gameDTO.Score = score;
    gameDTO.Push = push;
    gameDTO.Round = round;
    gameDTO.Difficulty = difficulty;
    gameDTO.Side = side;
    gameDTO.Background = background;
    gameDTO.Ball = ball;
    // gameDTO.Paddle = paddle;
    gameDTO.Type = type;
    // gameDTO.Mode = mode;

    await this.GameRepository.save(gameDTO);

    return gameDTO.uuid;
  }

  //Check si la partie existe
  async CheckIfGameExist(game_id: string): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        return true;
      }
    }
    return false;
  }

  //Check si la partie a deja un opponent
  async CheckIfGameHasOpponent(game_id: string): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.Opponent != -1) {
          return true;
        }
      }
    }
    return false;
  }

  //Check si la partie a deja 5 viewers
  async CheckIfGameHas5Viewers(game_id: string): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.Viewers_List.length >= 5) {
          return true;
        }
      }
    }
    return false;
  }

  //Check si le joueur est deja dans la game ou en viewer
  async CheckIfPlayerIsAlreadyInThisGame(
    game_id: string,
    user_id: number,
  ): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.Host == user_id) {
          return true;
        }
        if (game.Opponent == user_id) {
          return true;
        }
        if (game.Viewers_List.includes(user_id)) {
          return true;
        }
      }
    }
    return false;
  }

  //Ajoute le joueur dans la game en temps qu'opponent
  async AddPlayerToGame(game_id: string, user_id: number): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        game.Opponent = user_id;
        await this.GameRepository.save(game);
        return true;
      }
    }
    return false;
  }

  //Ajoute le joueur dans la game en temps que viewer
  async AddViewerToGame(game_id: string, user_id: number): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      //Check si le joueur est deja dans la game
      if (await this.CheckIfPlayerIsAlreadyInThisGame(game_id, user_id)) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        game.Viewers_List.push(user_id);
        await this.GameRepository.save(game);
        return true;
      }
    }
    return false;
  }

  //Retire le joueur de la game ( ne le retire pas mais on mets fin à la game )
  async RemovePlayerFromGame(game_id: string, user_id: number): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.Host == user_id || game.Opponent == user_id) {
          //Si game en cours -> on mets fin à la game
          if (game.Status == 'InProgress') {
            game.Status = 'Finished';
            await this.GameRepository.save(game);
          }
          //Si game en waiting -> Si host qui quitte -> on supprime la game
          if (game.Status == 'Waiting' && game.Host == user_id) {
            game.Status = 'Deleted';
            await this.GameRepository.save(game);
          }
          //Si game en waiting -> Si opponent qui quitte -> on mets fin a la game
          if (game.Status == 'Waiting' && game.Opponent == user_id) {
            game.Status = 'Finished';
            await this.GameRepository.save(game);
          }
          return true;
        }
        if (game.Viewers_List.includes(user_id)) {
          const index = game.Viewers_List.indexOf(user_id);
          if (index > -1) {
            game.Viewers_List.splice(index, 1);
          }
          await this.GameRepository.save(game);
          return true;
        }
      }
    }
    return false;
  }

  //Retire le joueur de toutes les game ou il est ( si game en Waiting ou InProgress )
  async RemovePlayerFromAllGames(user_id: number): Promise<any> {
    if (user_id != null) {
      const all_game = await this.GameRepository.find({
        where: { Status: 'Waiting' || 'InProgress' },
      });
      if (all_game != null) {
        for (let i = 0; i < all_game.length; i++) {
          this.RemovePlayerFromGame(all_game[i].uuid, user_id);
        }
        return true;
      }
    }
    return false;
  }

  //Check si la parti est en waiting
  async CheckIfGameIsWaiting(game_id: string): Promise<any> {
    if (game_id != null) {
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.GameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.Status == 'Waiting') {
          return true;
        }
      }
    }
    return false;
  }

  //Renvoi le nombre de joueur en attentes
  async GetNumberOfPlayerInMatchmaking(): Promise<any> {
    const all_user = await this.MatchMakeRepository.find();
    if (all_user != null) {
      return all_user.length;
    }
    return 0;
  }

  //Renvoi le nombre de personne connecté
  async GetNumberOfPlayerConnected(): Promise<any> {
    //Genere un nombre random entre 0 et 35
    const nb = Math.floor(Math.random() * 36);
    return nb;
  }

  //Cherche le nombre de game en cours ) partir de la liste getall
  async GetNumberOfGames(): Promise<any> {
    const nb_game = (
      await this.GameRepository.find({
        where: { Status: 'Waiting' || 'InProgress' },
      })
    ).length;
    return nb_game;
  }

  async GetPlayerName(player_id: number): Promise<string> {
    if (player_id != null) {
      const player = await this.UserRepository.findOne({
        where: { id: player_id },
      });
      if (player != null) {
        return player.login;
      }
    }
    //player id to string
    return 'Player_' + player_id;
  }

  // async Test(req: any): Promise<any> {

  //     try {

  //         //Anything

  //     } catch (error) {
  //         const Data = {
  //             success: false,
  //             message: "Catched an error",
  //         };
  //         return Data;
  //     }

  //     const Data = {
  //         success: false,
  //         message: "Case not handled",
  //     };
  //     return Data;
  // }
}
