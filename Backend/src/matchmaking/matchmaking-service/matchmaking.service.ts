import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDTO } from '../../lobby/dto/Game.dto';
import { Game } from 'src/utils/typeorm/Game.entity';

import { MatchmakingDTO } from '../dto/Matchmaking.dto';
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

import { User } from 'src/utils/typeorm/User.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchmakingService {
	constructor(
		@InjectRepository(Game)
		private readonly GameRepository: Repository<Game>,

		@InjectRepository(Matchmaking)
		private readonly MatchMakeRepository: Repository<Matchmaking>,

		@InjectRepository(User)
		private readonly UserRepository: Repository<User>,
	) { }

	async MatchmakeStart(req: any): Promise<any> {

		try {

			//Si il manque des datas
			if (req.body.type == null) {
				const Data = {
					success: false,
					message: 'Not enough parameters',
				};
				return Data;
			}
			
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
			if (await this.AddPlayerToMatchmaking(req.user.id, req.body.type)) {
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
						id: game.uuid,
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
			const game_id = await this.CheckIfTwoPlayerAreInMatchmaking(req.user.id);
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
	async CheckIfTwoPlayerAreInMatchmaking(user_id: number): Promise<any> {

		//Recupere le mode de jeu du joueur qui update
		const user = await this.MatchMakeRepository.findOne({where: { Player_Id : user_id }});
		const mode = user.Mode;

		const all_user = await this.MatchMakeRepository.find({where: { Mode : mode }});
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
					0,		//[!] à choisir ce qui est par default en ranked
					0,
					3,
					'left',
					'default',
					'default',
					'ranked',
					mode,
				);
				await this.AddPlayerToGame(game_id, user2.Player_Id);
				return game_id;
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

	// Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress" et renvoi true or false
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
	async AddPlayerToMatchmaking(user_id: number, type : string): Promise<any> {

		//Check si le joueur est deja dans la liste de matchmaking
		if (await this.CheckIfPlayerIsInMatchmaking(user_id)) {
			return false;
		}

		if (user_id != null) {
			const user = new MatchmakingDTO();
			user.Player_Id = user_id;
			user.CreatedAt = new Date();
			user.Mode = type;
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

	//Creer une game dans la base de donnée
	async CreateGameInDB(

		user_id: number,
		name: string,
		push: boolean,
		score: number,
		difficulty : number,
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
		gameDTO.Difficulty = difficulty;
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

}
