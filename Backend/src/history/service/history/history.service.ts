import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { History } from 'src/utils/typeorm/History.entity';
import { HistoryDto } from '../../dto/history.dto';

import { UserHistory } from 'src/utils/typeorm/UserHistory.entity';
import { UserHistoryDto } from '../../dto/UserHistory.dto';

import { User } from 'src/utils/typeorm/User.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

import { FullUserHistoryDto } from 'src/history/dto/FullUserHistory.dto';

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

  async getUserHistory(userId: number): Promise<any> {
    try {
      const userHistory: UserHistory[] = await this.userHistoryRepository.find({
        where: { userId: userId },
      });
      const History: History[] = await this.historyRepository.find();

      //combine userHistory and History into FullUserHistory
      const fullUserHistory: FullUserHistoryDto[] = [];
      userHistory.forEach((userHistory) => {
        History.forEach((history) => {
          if (userHistory.historyId === history.historyId) {
            const temp: FullUserHistoryDto = {
              userHistoryId: userHistory.userHistoryId,
              userId: userHistory.userId,
              historyId: userHistory.historyId,
              success: userHistory.success,
              level: history.level,
              title: history.title,
              description: history.description,
              push: history.push,
              score: history.score,
              round: history.round,
              difficulty: history.difficulty,
              background: history.background,
              ball: history.ball,
            };
            fullUserHistory.push(temp);
          }
        });
      });

      const Data = {
        success: true,
        message: 'Request successfull',
        data: fullUserHistory,
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
