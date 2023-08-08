import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/utils/typeorm/Game.entity';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';

import { GameService } from '@/game/service/game.service';
import { UsersService } from '@/users/users.service';
import { MatchmakingService } from '@/matchmaking/service/matchmaking.service';
import { ScoreService } from '@/score/service/score.service';

import { GameInfo, Player } from '@transcendence/shared/types/Game.types';

@Injectable()
export class LobbyService {
	constructor(
		@InjectRepository(Game)
		public readonly gameRepository: Repository<Game>,

		public readonly gameService: GameService,
		public readonly userService: UsersService,
		public readonly matchmakingService: MatchmakingService,
		public readonly scoreService: ScoreService,
	) { }
	async CreateGame(
		userId: number,
		newGame: CreateGameDTO,
	): Promise<ReturnData> {
		const ret: ReturnData = {
			success: false,
			message: 'Catched an error',
		};
		try {
			const gameId = await this.gameService.getGameByUserId(userId);
			if (gameId) {
				ret.message = 'You are already in a game';
				ret.data = gameId;
				return ret;
			}

			//Si le joueur recherche deja une partie
			else if (
				await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)
			) {
				ret.message = 'You are already in matchmaking';
				return ret;
			}

			const newGameId = await this.gameService.createGame(newGame);
			ret.success = true;
			ret.message = 'Game created';
			ret.data = newGameId;
			return ret;
		} catch (error) {
			ret.error = error;
			return ret;
		}
	}

	async JoinGame(userId: number, gameId: string): Promise<ReturnData> {
		const ret: ReturnData = {
			success: false,
			message: 'Catched an error',
		};
		try {
			const user = await this.userService.getUserById(userId);
			if (!user) {
				ret.message = 'User not found';
				return ret;
			}

			const game: Game = await this.gameService.getGameById(gameId);
			if (!game) {
				ret.message = 'Game not found';
				return ret;
			}

			//Si le joueur est deja dans cette partie
			if (game.host === userId || game.opponent === userId) {
				ret.success = true;
				ret.message = 'You are already in this game';
				return ret;
			}

			//Si deja un oposant et qu'il join en opponent (2 joueurs max)
			if (game.opponent !== -1) {
				ret.message = 'Game is full';
				return ret;
			}
			//Ajoute le joueur dans la game en opponent
			await this.gameService.addOpponent(gameId, userId);
			ret.success = true;
			ret.message = 'You joined the game as an opponent';
			ret.data = gameId;
			return ret;
		} catch (error) {
			ret.error = error;
			return ret;
		}
	}

	async GetAll(mode?: 'League' | 'Party'): Promise<ReturnData> {
		const ret: ReturnData = {
			success: false,
			message: 'Catched an error',
		};
		try {
			const games = await this.gameService.getCurrentGames();
			if (!games) {
				ret.message = 'No games found';
				return ret;
			}
			const gamesInfos: GameInfo[] = [];
			for (const game of games) {
				if (mode && game.mode !== mode) continue;
				const leftPlayer: Player = await this.gameService.definePlayer(
					game.hostSide === 'Left' ? game.host : game.opponent,
					'Left',
					game.hostSide === 'Left',
				);
				const rightPlayer: Player = await this.gameService.definePlayer(
					game.hostSide === 'Right' ? game.host : game.opponent,
					'Right',
					game.hostSide === 'Right',
				);
				const gameInfo: GameInfo = {
					id: game.id,
					name: game.name,
					type: game.type,
					mode: game.mode,
					leftPlayer: leftPlayer,
					rightPlayer: rightPlayer,
					actualRound: game.actualRound,
					maxRound: game.maxRound,
					status: game.status,
				};
				gamesInfos.push(gameInfo);
			}
			ret.success = true;
			ret.message = 'Games found';
			ret.data = gamesInfos;
			return ret;
		} catch (error) {
			ret.error = error;
			return ret;
		}
	}

	async Quit(userId: number): Promise<ReturnData> {
		const ret: ReturnData = {
			success: false,
			message: 'Catched an error',
		};
		try {
			const gameId = await this.gameService.getGameByUserId(userId);
			if (!gameId) {
				ret.message = 'You are already not in a game';
				return ret;
			}
			await this.gameService.quitGame(gameId, userId);
			ret.success = true;
			ret.message = 'You quit the game';
			return ret;
		} catch (error) {
			return ret;
		}
	}

	//Si le joueur est en game renvoie l'id, si le joueur en Matchmaking le retire de la liste
	async IsInGame(userId: number): Promise<ReturnData> {
		const ret: ReturnData = {
			success: false,
			message: 'Catched an error',
		};
		try {
			//Si le joueur est en matchmaking le retire de la liste
			if (await this.matchmakingService.CheckIfAlreadyInMatchmaking(userId)) {
				await this.matchmakingService.RemovePlayerFromMatchmaking(userId);
			}

			//Si il est dans une game recupere son id
			const gameId = await this.gameService.getGameByUserId(userId);
			if (!gameId) {
				ret.message = 'You are not in a game';
				return ret;
			}
			ret.success = true;
			ret.message = 'You are in a game';
			ret.data = gameId;
			return ret;
		} catch (error) {
			ret.error = error;
			return ret;
		}
	}





















	//Renvoi la liste des 10 meilleurs joueurs
	async GetTop10(): Promise<any> {

		const test = 
		[
			{
				login: "Zel",
				score: 666,
				rank: 1,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Loup",
				score: 456,
				rank: 2,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Periol",
				score: 42,
				rank: 3,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Boisson",
				score: 17,
				rank: 4,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
			{
				login: "Testt",
				score: 17,
				rank: 5,
				avatar: "/images/avatars/avatar1.png"
			},
		]	
		return test;
	}

	async GetAllRanked(): Promise<any> {

		const all_game_info = 
		[
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "3rounds",
				Color_Host: "#00FF00",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Loup",
				Opponent: "Periol",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "5rounds",
				Color_Host: "#00FF00",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Periol",
				Opponent: "Zel",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#00FF00",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#00FF00",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
			{
				uuid: "1234641",
				Name: "Game trop cool",
				Host: "Zel",
				Opponent: "Loup",
				Avatar_Host: "/images/avatars/avatar1.png",
				Avatar_Opponent: "/images/avatars/avatar1.png",
				Mode: "classic",
				Color_Host: "#0000FF",
				Color_Opponent: "#FF0000",
			},
		]
		return all_game_info;
	}

	//Renvoi les données necessaire dans l'onglet league
	async GetLeague(): Promise<any> {
		try {

			const Data = {
				success: true,
				message: 'Request successfulld',
				data: {
					Top10: await this.GetTop10(),
					AllRanked: await this.GetAllRanked(),
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

}
