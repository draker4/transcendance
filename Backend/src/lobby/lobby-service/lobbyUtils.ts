

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDTO } from '../dto/Game.dto';
import { Game } from 'src/utils/typeorm/Game.entity';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';
import { User } from 'src/utils/typeorm/User.entity';

import { v4 as uuidv4 } from 'uuid';

export class LobbyUtils {

	constructor(
		@InjectRepository(Game)
		public readonly GameRepository: Repository<Game>,

		@InjectRepository(Matchmaking)
		private readonly MatchMakeRepository: Repository<Matchmaking>,

		@InjectRepository(User)
		private readonly UserRepository: Repository<User>,
	) { }

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
		side: string,
		background: string,
		ball: string,
		type: string,
		mode: string,

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
		gameDTO.Side = side;
		gameDTO.Background = background;
		gameDTO.Ball = ball;
		gameDTO.Type = type;
		gameDTO.Mode = mode;

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

	//Check si le joueur est deja dans la game
	async CheckIfPlayerIsAlreadyInThisGame(game_id: string,user_id: number): Promise<any> {

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