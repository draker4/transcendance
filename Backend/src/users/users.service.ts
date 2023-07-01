/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/CreateUser.dto';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private cryptoService: CryptoService,
  ) {}

  async addUser(createUserDto: createUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async saveUserEntity(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async getUserByLogin(login: string) {
    return await this.userRepository.findOne({ where: { login: login } });
  }

  async getUserByEmail(email: string, provider: string) {
    const emailDecrypted = (
      await this.cryptoService.decrypt(email)
    ).toLowerCase();
    const clients = await this.userRepository.find();

    for (const client of clients) {
      const emailClient = await this.cryptoService.decrypt(client.email);
      if (
        emailClient.toLowerCase() === emailDecrypted
        && client.provider === provider
      )
        return client;
    }
    return null;
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async getUserChannels(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ["channels", "channels.avatar"],
    });
  }

  async getUserPongies(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ["pongies", "pongies.avatar"],
    });
  }

  async getUserAvatar(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ["avatar"],
    });
  }

  async getUserByCode(code: string) {
    return await this.userRepository.findOne({ where: { verifyCode: code } });
  }

  async updateUser(id: number, properties: Partial<User>) {
    await this.userRepository.update(id, properties);
  }

  async updateUserChannels(user: User, channel: Channel) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "channels")
      .of(user.id)
      .add(channel);
  }

  async updateUserAvatar(user: User, avatar: Avatar) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "avatar")
      .of(user.id)
      .set(avatar);
  }

  async updateUserPongies(user: User, pongie: User) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "pongies")
      .of(user.id)
      .add(pongie);
  }

  async getChannelByName(name: string) {
    return await this.channelRepository.findOne({ where: { name: name }, relations: ["users"] });
  }
}
