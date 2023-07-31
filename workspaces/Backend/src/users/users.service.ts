/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/CreateUser.dto';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { EditUserDto } from './dto/EditUser.dto';
import { repDto } from './dto/rep.dto';
import { Token } from 'src/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(BackupCode)
    private readonly backupCodeRepository: Repository<BackupCode>,
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
        emailClient.toLowerCase() === emailDecrypted &&
        client.provider === provider
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
      relations: ['channels', 'channels.avatar'],
    });
  }

  async getUserPongies(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['pongies', 'pongies.avatar'],
    });
  }

  async getUserAvatar(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['avatar'],
    });
  }

  async getUserBackupCodes(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['backupCodes'],
    });
  }

  async getUserTokens(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['tokens'],
    });
  }

  async saveToken(token: Token) {
    await this.tokenRepository.save(token);
  }

  async saveBackupCode(user: User, backupCode: string) {
    const backupCodeEntity = new BackupCode();
    backupCodeEntity.code = backupCode;
    backupCodeEntity.user = user;

    return await this.backupCodeRepository.save(backupCodeEntity);
  }

  async deleteToken(token: Token) {
    await this.tokenRepository.remove(token);
  }

  async deleteBackupCode(backupCode: BackupCode) {
    await this.backupCodeRepository.remove(backupCode);
  }

  async deleteAllUserTokens(user: User) {
    await this.tokenRepository.remove(user.tokens);
  }

  async deleteBackupCodes(user: User) {
    await this.backupCodeRepository.remove(user.backupCodes);
  }

  async getUserByCode(code: string) {
    return await this.userRepository.findOne({
      where: { verifyCode: code, verified: false }
    });
  }

  async updateUser(id: number, properties: Partial<User>) {
    await this.userRepository.update(id, properties);
  }

  async updateUserChannels(user: User, channel: Channel) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'channels')
      .of(user.id)
      .add(channel);
  }

  async updateUserAvatar(user: User, avatar: Avatar) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'avatar')
      .of(user.id)
      .set(avatar);
  }

  async updateUserPongies(user: User, pongie: User) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'pongies')
      .of(user.id)
      .add(pongie);
  }

  async updateUserBackupCodes(user: User, backupCodes: BackupCode[]) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'backupCodes')
      .of(user.id)
      .set(backupCodes);
  }

  async getChannelByName(name: string) {
    return await this.channelRepository.findOne({
      where: { name: name },
      relations: ['users'],
    });
  }

  async editUser(userId: number, properties: EditUserDto) {
    const rep: repDto = {
      success: false,
      message: '',
    };

    try {
      const updatedProperties: string[] = [];

      for (const key in properties) {
        if (properties.hasOwnProperty(key) && properties[key] !== undefined) {
          updatedProperties.push(key);
        }
      }

      if (updatedProperties.length > 0) {
        if (updatedProperties.indexOf('login') !== -1) {
          rep.message = 'sorry, editing login is not implemented yet';
        } else {
          this.updateUser(userId, properties);

          rep.success = true;
          rep.message = `Properties : ${updatedProperties.join(
            ', ',
          )} : successfully updated`;

          this.log(`${rep.message} for user : ${userId}`);
        }
      } else {
        rep.message = 'missing or incorrect properties sent in request';
      }
    } catch (error) {
      rep.message = error.message;
    }

    return rep;
  }

  // tools

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const yellow = '\x1b[33m';
    const stop = '\x1b[0m';

	process.stdout.write(yellow + '[user service]  ' + stop);
    console.log(message);
  }

  async checkPassword(userId: number, passwordCrypted: string) {
    try {
      const user = await this.getUserById(userId);

      if (!user)
        throw new Error('no user');
      
      const password = await this.cryptoService.decrypt(passwordCrypted);

      const isMatch = await bcrypt.compare(password, user.passwordHashed);
  
      if (!isMatch)
        return {
          success: false,
          error: 'wrong',
        };
      
      return {
        success: true,
      }
    }
    catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async updatePassword(userId: number, password: string) {
    try {
      const user = await this.getUserById(userId);

      if (!user)
        throw new Error('no user');
      
      await this.updateUser(user.id, {
        passwordHashed: password,
      })
      
      return {
        success: true,
      }
    }
    catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
