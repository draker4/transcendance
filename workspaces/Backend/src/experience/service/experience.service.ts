import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';
import { CreateExperienceDataDTO } from '../dto/CreateExperienceData.dto';

@Injectable()
export class ExperienceService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    @InjectRepository(ExperienceData)
    private readonly experienceDataRepository: Repository<ExperienceData>,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async getExperienceData(): Promise<ExperienceData[]> {
    try {
      let experienceDatas = await this.experienceDataRepository.find();
      if (!experienceDatas) {
        await this.createExperienceData();
        experienceDatas = await this.experienceDataRepository.find();
      }
      experienceDatas.sort((a, b) => a.level - b.level);
      return experienceDatas;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getNextLevelXp(level: number): Promise<number> {
    try {
      const experienceData = await this.experienceDataRepository.findOne({
        where: { level },
      });
      if (!experienceData) {
        throw new Error('Experience data not found');
      }
      return experienceData.cumulativeXP;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async createExperienceData(): Promise<void> {
    try {
      const levels: CreateExperienceDataDTO[] = [];
      for (let i = 0; i < 100; i++) {
        const level: CreateExperienceDataDTO = {
          level: i,
          levelXp: i === 0 ? 250 : levels[i - 1].levelXp * 1.5,
          cumulativeXP: i === 0 ? 0 : levels[i - 1].cumulativeXP,
        };
        level.cumulativeXP += level.levelXp;
        levels.push(level);
      }

      for (const level of levels) {
        await this.experienceDataRepository.save(level);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
