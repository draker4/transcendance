import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/CreateUser.dto';

// @Injectable()
// export class UsersService {

// 	constructor(
// 		@InjectRepository(User)
// 		private usersRepository: Repository<User>
// 	) {}

// 	findAll(): Promise<User[]> {
// 		return this.usersRepository.find();
// 	}

// 	addUser(createUserDto: createUserDto) {
// 		const newUser = this.usersRepository.create(createUserDto);

// 		return this.usersRepository.save(newUser);
// 	}
// }

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addUser(createUserDto: createUserDto): Promise<{message: string}> {
    await this.userRepository.save(createUserDto);
    return { message: 'User added successfully' };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }
}

