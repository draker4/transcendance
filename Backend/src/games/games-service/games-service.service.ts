import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameDTO } from '../dto/Game.dto'
import { Game } from 'src/typeorm/Game.entity';

import { MatchmakingDTO } from  '../dto/Matchmaking.dto'
import { Matchmaking } from 'src/typeorm/Matchmaking.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {

    constructor(
        @InjectRepository(Game)
        private readonly GameRepository: Repository<Game>,
        // @InjectRepository(Matchmaking)
        // private readonly MatchMakeRepository: Repository<Matchmaking>,
    ) {}


    async CreateGame(req: any): Promise<any> {

        //Si le joueur est déjà dans une partie

        //Si le joueur recherche deja une partie

        //Creer une game
        const gameDTO = new GameDTO(); 

        gameDTO.uuid = uuidv4();
        gameDTO.Name = "Game_" + gameDTO.uuid;
        gameDTO.Password = "";
        gameDTO.Host = req.user.id;
        gameDTO.Opponent = -1;
        // gameDTO.Viewers_List = [];
        gameDTO.Score_Host = 0;
        gameDTO.Score_Opponent = 0;
        gameDTO.Status = "Waiting";
        gameDTO.CreatedAt = new Date().toISOString();
        gameDTO.Winner = -1;
        gameDTO.Loser = -1;

        const Data = {
            success: true,
            message: "Game created",
            data: {
                id: gameDTO.uuid 
            }
        };
        
        await this.GameRepository.save(gameDTO);

        return Data;
    }
      

    async JoinGame(req: any): Promise<number> {
        return req.user.id;
    }

    async GetAll(req: any): Promise<number> {
        return req.user.id;
    }

    async Quit(req: any): Promise<number> {
        return req.user.id;
    }

    async MatchmakeStart(req: any): Promise<number> {
        return req.user.id;
    }

    async MatchmakeStop(req: any): Promise<number> {
        return req.user.id;
    }

    async MatchmakeUpdate(req: any): Promise<number> {
        return req.user.id;
    }

    //Fonction annexe : 

    // Check si le joueur est déjà dans une partie
    async CheckIfAlreadyInGame(user_id: number): Promise<any> {
        if (user_id != null) {
            const user = await this.GameRepository.findOne({ where: { Host : user_id } });
            if (user != null) {
                return true;
            }
        }
        return false;
    }
}






    // async addUser(createUserDto: createUserDto): Promise<User> {
    //     return await this.GameRepository.save(createUserDto);
    // }

    // async getUserByLogin(login: string) {
    //     return await this.GameRepository.findOne({ where: { login: ILike(login) } });
    // }

    // async updateUser(user: User) {
    //     await this.GameRepository.update(
    //     user.id,
    //     user
    //     );
    //     return this.getUserByLogin(user.login);
    // }