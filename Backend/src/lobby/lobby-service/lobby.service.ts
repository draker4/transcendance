import { Injectable } from '@nestjs/common';

import { LobbyUtils } from "./lobbyUtils";

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
				req.body.push,
				req.body.score,
				req.body.round,
				req.body.side,
				req.body.background,
				req.body.ball,
				req.body.type,
				req.body.mode,
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
					Side: games[i].Side,
					Background: games[i].Background,
					Ball: games[i].Ball,
					Type: games[i].Type,
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
				Side: game.Side,
				Background: game.Background,
				Ball: game.Ball,
				Type: game.Type,
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
