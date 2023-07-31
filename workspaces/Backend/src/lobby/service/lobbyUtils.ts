import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Game } from 'src/utils/typeorm/Game.entity';
import { GameService } from '@/game/service/game.service';
import { Score } from '@/utils/typeorm/Score.entity';

import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { UsersService } from '@/users/users.service';

export class LobbyUtils {
  constructor(
    @InjectRepository(Game)
    public readonly gameRepository: Repository<Game>,

    @InjectRepository(Score)
    public readonly scoreRepository: Repository<Score>,

    @InjectRepository(Matchmaking)
    private readonly MatchMakeRepository: Repository<Matchmaking>,

    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,

    public readonly gameService: GameService,
    public readonly userService: UsersService,
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

  //Check si la partie existe
  async CheckIfGameExist(game_id: string): Promise<any> {
    if (game_id != null) {
      //Check si c'est un id
      // if (game_id.length != 36) {
      //   return false;
      // }

      const game = await this.gameRepository.findOne({
        where: { id: game_id },
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
      //Check si c'est un id
      if (game_id.length != 36) {
        return false;
      }

      const game = await this.gameRepository.findOne({
        where: { id: game_id },
      });

      if (game != null) {
        if (game.opponent != -1) {
          return true;
        }
      }
    }
    return false;
  }

  //Retire le joueur de la game ( ne le retire pas mais on mets fin à la game )
  async RemovePlayerFromGame(gameId: string, userId: number): Promise<any> {
    if (gameId != null) {
      const game = await this.gameRepository.findOne({
        where: { id: gameId },
      });
      if (game != null) {
        //Si game n'a pas commencé
        if (
          game.status == 'Not Started' &&
          (game.host == userId || game.opponent == userId)
        ) {
          game.status = 'Deleted';
          game.result = 'Deleted';
          await this.gameRepository.save(game);
        }
        //Si game en cours
        else if (
          game.status == 'Playing' &&
          (game.host == userId || game.opponent == userId)
        ) {
          game.status = 'Finished';
          if (game.host == userId) {
            game.result = 'Opponent';
          } else {
            game.result = 'Host';
          }
          await this.gameRepository.save(game);
        }
      }
    }
    return false;
  }

  //Retire le joueur de toutes les game ou il est ( si game en Waiting ou Playing )
  async RemovePlayerFromAllGames(userId: number): Promise<any> {
    if (userId != null) {
      const all_game = await this.gameRepository.find({
        where: { status: 'Not Started' || 'Stopped' || 'Playing' },
      });
      if (all_game != null) {
        for (let i = 0; i < all_game.length; i++) {
          this.RemovePlayerFromGame(all_game[i].id, userId);
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
