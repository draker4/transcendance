import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { CreateAchievementDTO } from '@/achievement/dto/CreateAchievement.dto';
import { UpdateAchievementDTO } from '@/achievement/dto/UpdateAchievement.dto';
import { CreateAchievementDataDTO } from '../dto/CreateAchievementData.dto';
import {
  UserAchievement,
  AchievementStatus,
  FullAchievement,
} from '@transcendence/shared/types/Achievement.types';

@Injectable()
export class AchievementService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(AchievementData)
    private readonly achievementDataRepository: Repository<AchievementData>,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async createAchievement(
    newAchievement: CreateAchievementDTO,
  ): Promise<Achievement> {
    try {
      const achievement = await this.achievementRepository.save(newAchievement);
      return achievement;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async achievementCompleted(
    userId: number,
    update: UpdateAchievementDTO,
  ): Promise<void> {
    try {
      const achievement = await this.achievementDataRepository.findOne({
        where: { name: update.name },
      });
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      const userAchievement = await this.achievementRepository.findOne({
        where: { userId: userId },
      });
      if (!userAchievement) {
        throw new Error('User achievement not found');
      }

      const achievementProperty = `achv${achievement.id}Completed`;

      if (!userAchievement[achievementProperty]) {
        userAchievement[achievementProperty] = true;
        userAchievement[`achv${achievement.id}TBA`] = true;
      } else return;

      await this.achievementRepository.save(userAchievement);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async achievementAnnonced(
    userId: number,
    achievementId: string,
  ): Promise<void> {
    try {
      const userAchievement = await this.achievementRepository.findOne({
        where: { userId: userId },
      });
      if (!userAchievement) {
        throw new Error('User achievement not found');
      }

      const achievementProperty = `achv${achievementId}Completed`;

      if (userAchievement[achievementProperty]) {
        userAchievement[`achv${achievementId}TBA`] = false;
      } else return;

      await this.achievementRepository.save(userAchievement);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getUserAchievement(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const userAchievements = await this.achievementRepository.findOne({
        where: { userId: userId },
      });

      if (!userAchievements) {
        ret.message = 'Achievement not found';
        return ret;
      }

      const achievementStatus: AchievementStatus[] = Array.from(
        { length: 30 },
        (_, i) => ({
          id: (i + 1).toString(),
          completed: userAchievements[`achv${i + 1}`],
          toBeAnnounced: userAchievements[`achv${i + 1}TBA`],
        }),
      );

      let achievementDatas: AchievementData[] =
        await this.achievementDataRepository.find();

      if (!achievementDatas || achievementDatas.length === 0) {
        await this.createAchievementData();
        achievementDatas = await this.achievementDataRepository.find();

        if (!achievementDatas || achievementDatas.length === 0) {
          ret.message = 'Cannot create achievements';
          return ret;
        }
      }

      const fullachievement: FullAchievement[] = achievementStatus.map(
        (data, i) => ({
          id: achievementDatas[i].id,
          name: achievementDatas[i].name,
          description: achievementDatas[i].description,
          type: achievementDatas[i].type,
          xp: achievementDatas[i].xp,
          completed: data.completed,
        }),
      );

      const toBeAnnounced: string[] = [];
      for (const achievement of achievementStatus) {
        if (achievement.toBeAnnounced) {
          toBeAnnounced.push(achievement.id);
        }
      }

      const userAchievement: UserAchievement = {
        list: fullachievement,
        toBeAnnounced: toBeAnnounced,
      };

      ret.success = true;
      ret.message = 'Achievement found';
      ret.data = userAchievement;
      return ret;
    } catch (error) {
      ret.error = error.message;
      return ret;
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async createAchievementData(): Promise<void> {
    try {
      const levels: CreateAchievementDataDTO[] = [
        {
          name: 'First Blood',
          description: 'Win your first game',
          type: 'game',
          xp: 100,
        },
        {
          name: 'Love to Win',
          description: 'Win 10 games',
          type: 'game',
          xp: 200,
        },
        {
          name: 'Master of Win',
          description: 'Win 100 games',
          type: 'game',
          xp: 500,
        },
        {
          name: 'The Winner',
          description: 'Win 1000 games',
          type: 'game',
          xp: 1000,
        },
        {
          name: "Next time, I'll win",
          description: 'Lose your first games',
          type: 'game',
          xp: 100,
        },
        {
          name: 'This is not my day',
          description: 'Lose 10 games',
          type: 'game',
          xp: 200,
        },
        {
          name: 'Seriously?',
          description: 'Lose 100 games',
          type: 'game',
          xp: 500,
        },
        {
          name: 'I give up',
          description: 'Lose 1000 games',
          type: 'game',
          xp: 1000,
        },
        {
          name: 'The start of a journey',
          description: 'Win your first league game',
          type: 'league',
          xp: 100,
        },
        {
          name: 'The journey continues',
          description: 'Win 10 league games',
          type: 'league',
          xp: 200,
        },
        {
          name: 'The journey is endless',
          description: 'Win 100 league games',
          type: 'league',
          xp: 500,
        },
        {
          name: 'Lets play my friends',
          description: 'Play your first party game',
          type: 'party',
          xp: 100,
        },
        {
          name: 'Is that all you got?',
          description: 'Play 10 party games',
          type: 'party',
          xp: 200,
        },
        {
          name: 'I am the best',
          description: 'Play 100 games party games',
          type: 'party',
          xp: 500,
        },
        {
          name: 'lets try this',
          description: 'Win your first training game',
          type: 'training',
          xp: 100,
        },
        {
          name: 'I am getting better',
          description: 'Win 10 training games',
          type: 'training',
          xp: 200,
        },
        {
          name: 'work hard play hard',
          description: 'Win 100 training games',
          type: 'training',
          xp: 500,
        },
        {
          name: 'The first but not the last',
          description: 'Win the first story',
          type: 'training',
          xp: 100,
        },
        {
          name: 'Just the basics',
          description: 'Win the 3rd story',
          type: 'training',
          xp: 200,
        },
        {
          name: 'only the middle',
          description: 'Win the 5th story',
          type: 'training',
          xp: 500,
        },
        {
          name: 'This just got serious',
          description: 'Win the 7th story',
          type: 'training',
          xp: 500,
        },
        {
          name: 'Transcendence has been achieved',
          description: 'Win the 10th story',
          type: 'training',
          xp: 1000,
        },
        {
          name: 'So that is how you do it',
          description: 'Watch a demo',
          type: 'demo',
          xp: 100,
        },
        {
          name: 'I am a fan',
          description: 'Watch 10 demos',
          type: 'demo',
          xp: 200,
        },
        {
          name: 'I am a super fan',
          description: 'Watch 100 demos',
          type: 'demo',
          xp: 500,
        },
        {
          name: 'Embrace the darkness',
          description: 'Login with 42',
          type: 'account',
          xp: 100,
        },
        {
          name: 'What is up Google?',
          description: 'Login with Google',
          type: 'account',
          xp: 100,
        },
        {
          name: 'I am so beautiful',
          description: 'Upload your profile picture',
          type: 'account',
          xp: 100,
        },
        {
          name: 'I am a real person',
          description: 'Verify your email',
          type: 'account',
          xp: 100,
        },
        {
          name: 'be like Fort Knox',
          description: 'Enable double authentication',
          type: 'account',
          xp: 100,
        },
      ];

      for (const level of levels) {
        await this.achievementDataRepository.save(level);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}