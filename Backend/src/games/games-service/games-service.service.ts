import { Body, Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDTO } from '../dto/Game.dto'
import { Game } from 'src/utils/typeorm/Game.entity';

import { MatchmakingDTO } from  '../dto/Matchmaking.dto'
import { Matchmaking } from 'src/utils/typeorm/Matchmaking.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)
        private readonly GameRepository: Repository<Game>,

        @InjectRepository(Matchmaking)
        private readonly MatchMakeRepository: Repository<Matchmaking>,
    ) {}


    async CreateGame(req: any): Promise<any> {
        try {

            //Si le joueur est déjà dans une partie
            if (await this.CheckIfAlreadyInGame(req.user.id)) {
                const Data = {
                    success: false,
                    message: "You are already in a game",
                };
                return Data;
            }

            //Si le joueur recherche deja une partie
            if (await this.CheckIfAlreadyInMatchmaking(req.user.id)) {
                const Data = {
                    success: false,
                    message: "You are already in matchmaking",
                };
                return Data;
            }

            //Creer une game
            const game_id = await this.CreateGameInDB(req.user.id);
            const Data = {
                success: true,
                message: "Game created",
                data: {
                    id: game_id
                }
            };

            return Data;
   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
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
                    message: "Not enough parameters",
                };
                return Data
            }

            //Si la partie existe pas
            if (!await this.CheckIfGameExist(req.body.game_id)) {
                const Data = {
                    success: false,
                    message: "Game doesn't exist",
                };
                return Data;
            }

            //Check si on a le bon password
            if (!await this.CheckIfPasswordIsCorrect(req.body.game_id, req.body.password)) {
                const Data = {
                    success: false,
                    message: "Wrong password",
                };
                return Data;
            }

            //Si le joueur est deja dans cette partie
            if (await this.CheckIfPlayerIsAlreadyInThisGame(req.body.game_id, req.user.id)) {
                const Data = {
                    success: true,
                    message: "You are already in this game",
                };
                return Data;
            }

            //Si la partie est plus en waiting 
            if (!await this.CheckIfGameIsWaiting(req.body.game_id)) {
                const Data = {
                    success: false,
                    message: "Game started",
                };
                return Data;
            }

            //Check si la game est deja full viewer ( 5 viewer max )
            if (req.body.join_as == "viewer" && await this.CheckIfGameHas5Viewers(req.body.game_id)) {
                const Data = {
                    success: false,
                    message: "Game already has 5 viewers",
                };
                return Data;
            }

            //Ajoute le joueur dans la game en viewer
            if (req.body.join_as == "viewer" && await this.AddViewerToGame(req.body.game_id, req.user.id)) {
                const Data = {
                    success: true,
                    message: "You joined the game as a viewer",
                };
                return Data;
            }

            //Si deja un oposant et qu'il join en opponent (2 joueurs max)
            if (req.body.join_as == "opponent" && await this.CheckIfGameHasOpponent(req.body.game_id)) {
                const Data = {
                    success: false,
                    message: "Game already has an opponent",
                };
                return Data;
            }

            //Ajoute le joueur dans la game en opponent
            if (req.body.join_as == "opponent" && await this.AddPlayerToGame(req.body.game_id, req.user.id)) {
                const Data = {
                    success: true,
                    message: "You joined the game as an opponent",
                };
                return Data;
            }


   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }

        const Data = {
            success: false,
            message: "Case not handled",
        };
        return Data;
    }

    async GetAll(req: any): Promise<any> {
        try {

            //Renvoi toutes les games Waiting ou InProgress
            const games = await this.GameRepository.find({ where: { Status : "Waiting" || "InProgress" } });
            const Data = {
                success: true,
                message: "Request successfulld",
                data: games
            };
            return Data;
   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }
    }

    async Quit(req: any): Promise<any> {
        try {

            //Regarde is le joueur est dans une game 
            if (!await this.CheckIfAlreadyInGame(req.user.id)) {
                const Data = {
                    success: false,
                    message: "You are not in a game",
                };
                return Data;
            }

            //Retire le joueur de toutes les game ou il est ( si game en Waiting ou InProgress )
            if (await this.RemovePlayerFromAllGames(req.user.id)) {
                const Data = {
                    success: true,
                    message: "You are not in a game anymore",
                };
                return Data;
            }
            

   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }

        const Data = {
            success: false,
            message: "Case not handled",
        };
        return Data;
    }

    async MatchmakeStart(req: any): Promise<any> {
        try {

            //Anything
   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }

        const Data = {
            success: false,
            message: "Case not handled",
        };
        return Data;
    }

    async MatchmakeStop(req: any): Promise<any> {
        try {

            //Anything
   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }

        const Data = {
            success: false,
            message: "Case not handled",
        };
        return Data;
    }

    async MatchmakeUpdate(req: any): Promise<any> {
        try {

            //Anything
   
        } catch (error) {
            const Data = {
                success: false,
                message: "Catched an error",
                error: error
            };
            return Data;
        }

        const Data = {
            success: false,
            message: "Case not handled",
        };
        return Data;
    }

    //===========================================================Fonction annexe===========================================================

    // Check si le joueur est déjà dans une partie et que la partie est en "Waiting ou InProgress"
    async CheckIfAlreadyInGame(user_id: number): Promise<any> {
        if (user_id != null) {
            const host = await this.GameRepository.findOne({ where: { Host : user_id, Status : "Waiting" || "InProgress" } });
            if (host != null) {
                return true;
            }
            const opponent = await this.GameRepository.findOne({ where: { Opponent : user_id, Status : "Waiting" || "InProgress" } });
            if (opponent != null) {
                return true;
            }
        }
        return false;
    }

    // Check si le joueur recherche deja une partie
    async CheckIfAlreadyInMatchmaking(user_id: number): Promise<any> {
        if (user_id != null) {
            const user = await this.MatchMakeRepository.findOne({ where: { Player : user_id } });
            if (user != null) {
                return true;
            }
        }
        return false;
    }

    //Creer une game dans la base de donnée
    async CreateGameInDB(user_id: number): Promise<any> {

        const gameDTO = new GameDTO(); 

        gameDTO.uuid = uuidv4();
        gameDTO.Name = "Game_" + gameDTO.uuid;
        gameDTO.Password = "";
        gameDTO.Host = user_id;
        gameDTO.Opponent = -1;
        gameDTO.viewersList = [];
        gameDTO.Score_Host = 0;
        gameDTO.Score_Opponent = 0;
        gameDTO.Status = "Waiting";
        gameDTO.CreatedAt = new Date().toISOString();
        gameDTO.Winner = -1;
        gameDTO.Loser = -1;

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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
            if (game != null) {
                if (game.Viewers_List.length >= 5) {
                    return true;
                }
            }
        }
        return false;
    }

    //Check si le joueur est deja dans la game ou en viewer
    async CheckIfPlayerIsAlreadyInThisGame(game_id: string, user_id: number): Promise<any> {
        if (game_id != null) {

            //Check si c'est un uuid
            if (game_id.length != 36) {
                return false;
            }

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
            if (game != null) {
                if (game.Host == user_id || game.Opponent == user_id) {
                    //Si game en cours -> on mets fin à la game
                    if (game.Status == "InProgress") {
                        game.Status = "Finished";
                        await this.GameRepository.save(game);
                    }
                    //Si game en waiting -> Si host qui quitte -> on supprime la game
                    if (game.Status == "Waiting" && game.Host == user_id) {
                        game.Status = "Deleted";
                        await this.GameRepository.save(game);
                    }
                    //Si game en waiting -> Si opponent qui quitte -> on mets fin a la game
                    if (game.Status == "Waiting" && game.Opponent == user_id) {
                        game.Status = "Finished";
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
            
            const all_game = await this.GameRepository.find({ where: { Status : "Waiting" || "InProgress" } });
            if (all_game != null) {
                for (let i = 0; i < all_game.length; i++) {
                    this.RemovePlayerFromGame(all_game[i].uuid, user_id);
                }
                return true;
            }
        }
        return false;
    }

    //Verifie si on a le bon mdp pour rejoindre la game ( si pas de mots de pass tout est accepté)
    async CheckIfPasswordIsCorrect(game_id: string, password: string): Promise<any> {

        if (game_id == null || game_id.length != 36) {
            return false;
        }

        const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
        if (game.Password == "") {
            return true;
        }

        if (game != null) {
            if (game.Password == password) {
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

            const game = await this.GameRepository.findOne({ where: { uuid : game_id } });
            if (game != null) {
                if (game.Status == "Waiting") {
                    return true;
                }
            }
        }
        return false;
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