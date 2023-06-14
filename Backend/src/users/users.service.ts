import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/CreateUser.dto';
import { CryptoService } from 'src/utils/crypto/crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}

  async addUser(createUserDto: createUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async getUserByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login: login } });
  }
  
  async getUserByEmail(email: string, provider: string) {
    const emailDecrypted = (await this.cryptoService.decrypt(email)).toLowerCase();
    const clients = await this.userRepository.find();

    for (const client of clients) {
      const emailClient = await this.cryptoService.decrypt(client.email);
      if (emailClient.toLowerCase() === emailDecrypted && client.provider === provider)
        return client;
    }

    return null;
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async getUserByCode(code: string) {
    return await this.userRepository.findOne({ where: { verifyCode: code } });
  }

  async updateUser(user: User) {
    await this.userRepository.update(
      user.id,
      user
    );
  }
}

