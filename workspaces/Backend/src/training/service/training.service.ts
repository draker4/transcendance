import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Training } from 'src/utils/typeorm/Training.entity';
import { TrainingDto } from 'src/training/dto/training.dto';

import { User } from 'src/utils/typeorm/User.entity';

import { UpdateTrainingLevelDto } from 'src/training/dto/updateTrainingLevel.dto';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTraining(): Promise<any> {
    try {
      const Training: Training[] = await this.trainingRepository.find();
      if (Training.length === 0) {
        const Data = {
          success: false,
          message: 'No training found',
        };
        return Data;
      }
      const Data = {
        success: true,
        message: 'Request successfull',
        data: Training,
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

  async getUserTrainingLevel(userId: number): Promise<any> {
    try {
      const User: User[] = await this.userRepository.find({
        where: { id: userId },
      });
      const UserTrainingLevel: number = User[0].trainingLevel;
      const Data = {
        success: true,
        message: 'Request successfull',
        data: UserTrainingLevel,
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

  async UpdateUserTrainingLevel(
    userId: number,
    updateTrainingLevelDto: UpdateTrainingLevelDto,
  ): Promise<any> {
    try {
      const User: User[] = await this.userRepository.find({
        where: { id: userId },
      });
      User[0].trainingLevel = updateTrainingLevelDto.levelValidated;
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

  async initTraining(initialTraining: TrainingDto[]): Promise<any> {
    try {
      let Training: Training[] = await this.trainingRepository.find();
      if (Training.length !== 0) {
        const Data = {
          success: true,
          message: 'Training already initialized',
        };
        return Data;
      }
      initialTraining.forEach(async (trainingDto) => {
        await this.trainingRepository.save(trainingDto);
      });
      Training = await this.trainingRepository.find();
      const Data = {
        success: true,
        message: 'Request successfull',
        data: Training,
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
