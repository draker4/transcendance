import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { History } from 'src/utils/typeorm/history.entity';
import { HistoryDto } from '../../dto/history.dto';

import { UserHistory } from 'src/utils/typeorm/userHistory.entity';
import { UserHistoryDto } from '../../dto/userHistory.dto';

import { User } from 'src/utils/typeorm/user.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    @InjectRepository(UserHistory)
    private readonly userHistoryRepository: Repository<UserHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async GetAllHistory() {
    try {
      const history: History[] = await this.historyRepository.find();
      const Data = {
        success: true,
        message: 'Request successfull',
        data: history,
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

  async GetHistoryDetailsById(historyId: number) {}

  async GetHistorySettingsById(historyId: number) {}

  async PostInitialHistory(historyDto: HistoryDto) {}

  async GetUserHistoryStatus(userId: number) {}

  async UpdateUserHistoryStatus(userHistoryId: number) {}

  async PostInitialUserHistoryStatus(userHistoryDto: UserHistoryDto) {}
}
