import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { History } from 'src/utils/typeorm/History.entity';
import { HistoryDto } from '../../dto/history.dto';

import { UserHistory } from 'src/utils/typeorm/UserHistory.entity';
// import { UserHistoryDto } from '../../dto/UserHistory.dto';

import { User } from 'src/utils/typeorm/User.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

import { FullUserHistoryDto } from 'src/history/dto/FullUserHistory.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getHistory(): Promise<any> {
    try {
      const History: History[] = await this.historyRepository.find();
      const Data = {
        success: true,
        message: 'Request successfull',
        data: History,
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

  async getUserHistoryLevel(userId: number): Promise<any> {
    try {
      const User: User[] = await this.userRepository.find({
        where: { id: userId },
      });
      const UserHistoryLevel: number = User[0].historyLevel;
      const Data = {
        success: true,
        message: 'Request successfull',
        data: UserHistoryLevel,
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
