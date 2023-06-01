import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User.entity';
import { ILike, Repository } from 'typeorm';
import { createUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addUser(createUserDto: createUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async getUserByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login: ILike(login) } });
  }
  
  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email: ILike(email) }});
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async updateUser(user: User) {
    await this.userRepository.update(
      user.id,
      user
    );
    return this.getUserByLogin(user.login);
  }
}

