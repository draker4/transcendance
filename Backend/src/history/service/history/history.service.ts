import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { History } from 'src/utils/typeorm/History.entity';
import { HistoryDto } from '../../dto/history.dto';

import { User } from 'src/utils/typeorm/User.entity';

import { UpdateHistoryLevelDto } from 'src/history/dto/updateHistoryLevel.dto';

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
      if (History.length === 0) {
        const Data = {
          success: false,
          message: 'No history found',
        };
        return Data;
      }
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

  async UpdateUserHistoryLevel(
    userId: number,
    updateHistoryLevelDto: UpdateHistoryLevelDto,
  ): Promise<any> {
    try {
      const User: User[] = await this.userRepository.find({
        where: { id: userId },
      });
      User[0].historyLevel = updateHistoryLevelDto.levelValidated;
      await this.userRepository.save(User[0]);
      const Data = {
        success: true,
        message: 'Request successfull',
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

  async initHistory(initialHistory: HistoryDto[]): Promise<any> {
    try {
      let History: History[] = await this.historyRepository.find();
      if (History.length !== 0) {
        const Data = {
          success: true,
          message: 'History already initialized',
        };
        return Data;
      }
      initialHistory.forEach(async (historyDto) => {
        await this.historyRepository.save(historyDto);
      });
      History = await this.historyRepository.find();
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
}
