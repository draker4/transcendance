import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameTable } from '../Table/Game.dto'
import { Game } from 'src/typeorm/Game.entity';

@Injectable()
export class GamesService {

    constructor(
        // @InjectRepository(Game)
        // private readonly GameRepository: Repository<Game>,
    ) {}

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
}
