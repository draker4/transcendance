import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateGameDTO } from '@/game/dto/CreateGame.dto';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';

import { v4 as uuidv4 } from 'uuid';

export class LobbyUtils {
  constructor(
    @InjectRepository(Game)
    public readonly gameRepository: Repository<Game>,

    @InjectRepository(Matchmaking)
    private readonly MatchMakeRepository: Repository<Matchmaking>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  // Retire un joueur de la liste de matchmaking
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

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou Playing"
  async checkIfAlreadyInGame(userId: number): Promise<any> {
    if (userId != null) {
      const host = await this.gameRepository.findOne({
        where: { host: userId, status: 'Waiting' || 'Playing' },
      });
      if (host != null) {
        return true;
      }
      const opponent = await this.gameRepository.findOne({
        where: { opponent: userId, status: 'Waiting' || 'Playing' },
      });
      if (opponent != null) {
        return true;
      }
    }
    return false;
  }

  // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou Playing" et renvoi son id de game
  async getGameId(userId: number): Promise<any> {
    if (userId != null) {
      const game = await this.gameRepository.findOne({
        where: { host: userId, status: 'Waiting' || 'Playing' },
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
  // async CreateGameInDB(
  //   name: string,
  //   type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training',
  //   mode: 'League' | 'Party' | 'Training',
  //   userId: number,
  //   hostSide: 'Left' | 'Right',
  //   maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9,
  //   maxRound: 1 | 3 | 5 | 7 | 9,
  //   difficulty: 1 | 2 | 3 | 4 | 5,
  //   push: boolean,
  //   background: string,
  //   ball: string,
  // ): Promise<any> {
  //   const gameDTO = new CreateGameDTO();
  //   gameDTO.uuid = uuidv4();
  //   gameDTO.name = name;
  //   gameDTO.type = type;
  //   gameDTO.mode = mode;
  //   gameDTO.host = userId;
  //   gameDTO.hostSide = hostSide;
  //   gameDTO.maxPoint = maxPoint;
  //   gameDTO.maxRound = maxRound;
  //   gameDTO.difficulty = difficulty;
  //   gameDTO.push = push;
  //   gameDTO.background = background;
  //   gameDTO.ball = ball;
  //   await this.gameRepository.save(gameDTO);
  //   return gameDTO.uuid;
  // }

  //Check si la partie existe
  async CheckIfGameExist(game_id: string): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      // if (game_id.length != 36) {
      //   return false;
      // }

      const game = await this.gameRepository.findOne({
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

      const game = await this.gameRepository.findOne({
        where: { uuid: game_id },
      });

      if (game != null) {
        if (game.opponent != -1) {
          return true;
        }
      }
    }
    return false;
  }

  //Check si le joueur est deja dans la game
  async CheckIfPlayerIsAlreadyInThisGame(
    game_id: string,
    user_id: number,
  ): Promise<any> {
    if (game_id != null) {
      //Check si c'est un uuid
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.gameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        if (game.host == user_id) {
          return true;
        }
        if (game.opponent == user_id) {
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

      const game = await this.gameRepository.findOne({
        where: { uuid: game_id },
      });
      if (game != null) {
        game.opponent = user_id;
        await this.gameRepository.save(game);
        return true;
      }
    }
    return false;
  }

  //Retire le joueur de la game ( ne le retire pas mais on mets fin à la game )
  async RemovePlayerFromGame(gameId: string, userId: number): Promise<any> {
    if (gameId != null) {
      const game = await this.gameRepository.findOne({
        where: { uuid: gameId },
      });
      if (game != null) {
        if (game.host == userId || game.opponent == userId) {
          //Si game en cours -> on mets fin à la game
          if (game.status == 'Playing') {
            game.status = 'Finished';
            await this.gameRepository.save(game);
          }

          //Si game en waiting -> Si host qui quitte -> on supprime la game
          if (game.status == 'Waiting' && game.host == userId) {
            game.status = 'Deleted';
            await this.gameRepository.save(game);
          }

          //Si game en waiting -> Si opponent qui quitte -> on mets fin a la game
          if (game.status == 'Waiting' && game.opponent == userId) {
            game.status = 'Finished';
            await this.gameRepository.save(game);
          }
          return true;
        }
      }
    }
    return false;
  }

  //Retire le joueur de toutes les game ou il est ( si game en Waiting ou Playing )
  async RemovePlayerFromAllGames(userId: number): Promise<any> {
    if (userId != null) {
      const all_game = await this.gameRepository.find({
        where: { status: 'Waiting' || 'Playing' },
      });
      if (all_game != null) {
        for (let i = 0; i < all_game.length; i++) {
          this.RemovePlayerFromGame(all_game[i].uuid, userId);
        }
        return true;
      }
    }
    return false;
  }

  //Renvoi le login du joueur
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
}
