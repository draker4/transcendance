import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from 'src/utils/typeorm/Game.entity';

import { MatchmakingDTO } from '../dto/Matchmaking.dto';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

import { User } from 'src/utils/typeorm/User.entity';

import { CreateGameDTO } from '@/game/dto/CreateGame.dto';
import { GameService } from '@/game/service/game.service';

@Injectable()
export class MatchmakingService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Matchmaking)
    private readonly MatchMakeRepository: Repository<Matchmaking>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    private readonly gameService: GameService,
  ) {}

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

      //Si erreur
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }

    //Si un cas n'est pas geré
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

      //Si erreur
    } catch (error) {
      const Data = {
        success: false,
        message: 'Catched an error',
        error: error,
      };
      return Data;
    }

    //Si un cas n'est pas geré
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
            id: game.id,
          },
        };
        return Data;
      }

      //Check si le joueur est deja dans le matchmaking
      if (!(await this.CheckIfAlreadyInMatchmaking(req.user.id))) {
        const Data = {
          success: false,
          message: 'You are not in matchmaking',
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
          },
        };
        return Data;
      }

      //Si pas d'autre joueur trouvé
      const Data = {
        success: true,
        message: 'Waiting for opponent',
      };
      return Data;

      //Si erreur
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
        const createGameDTO: CreateGameDTO = {
          name: name_1 + ' vs ' + name_2,
          type: 'Classic',
          mode: 'League',
          host: user1.Player_Id,
          opponent: user2.Player_Id,
          hostSide: 'Left',
          maxPoint: 9,
          maxRound: 1,
          difficulty: 2,
          push: false,
          pause: false,
          background: 'classic',
          ball: 'classic',
        };
        try {
          const gameId = await this.gameService.createGame(createGameDTO);
          return gameId;
        } catch (error) {
          return false;
        }
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

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress" et renvoi son id de game
  async GetGameId(user_id: number): Promise<any> {
    if (user_id != null) {
      let game = await this.gameRepository.findOne({
        where: {
          host: user_id,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (game != null) {
        return game;
      }
      game = await this.gameRepository.findOne({
        where: {
          opponent: user_id,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (game != null) {
        return game;
      }
    }
    return false;
  }

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress" et renvoi true or false
  async CheckIfAlreadyInGame(user_id: number): Promise<any> {
    if (user_id != null) {
      const host = await this.gameRepository.findOne({
        where: {
          host: user_id,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (host != null) {
        return true;
      }
      const opponent = await this.gameRepository.findOne({
        where: {
          opponent: user_id,
          status: 'Not Started' || 'Stopped' || 'Playing',
        },
      });
      if (opponent != null) {
        return true;
      }
    }
    return false;
  }

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

  async GetPlayerName(player_id: number): Promise<string> {
    if (player_id != null) {
      const player = await this.UserRepository.findOne({
        where: { id: player_id },
      });
      if (player != null) {
        return player.login;
      }
    }
    return 'Player_' + player_id;
  }

  //Ajoute le joueur dans la game en temps qu'opponent
  async AddPlayerToGame(game_id: string, user_id: number): Promise<any> {
    if (game_id != null) {
      //Check si c'est un id
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.gameRepository.findOne({
        where: { id: game_id },
      });
      if (game != null) {
        game.opponent = user_id;
        await this.gameRepository.save(game);
        return true;
      }
    }
    return false;
  }
}
