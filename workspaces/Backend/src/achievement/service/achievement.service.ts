import { Injectable, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
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
  AchievementAnnonce,
  FullAchivement,
} from '@transcendence/shared/types/Achievement.types';
import { StatsService } from '@/stats/service/stats.service';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { UsersService } from '@/users/service/users.service';

@Injectable()
export class AchievementService implements OnModuleInit {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(AchievementData)
    private readonly achievementDataRepository: Repository<AchievementData>,
    @InjectRepository(Notif)
    private readonly notifRepository: Repository<Notif>,

    @Inject(forwardRef(() => StatsService))
    private readonly statsService: StatsService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  public achivementAnnonce: AchievementAnnonce[] = [];

  onModuleInit() {
    this.createAchievementData();
  }

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
        where: { code: update.code },
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

      if (!userAchievement[`achv${achievement.id}Completed`]) {
        userAchievement[`achv${achievement.id}Completed`] = true;
        userAchievement[`achv${achievement.id}Date`] = new Date();
      } else return;
      const annonce: UserAchievement = {
        id: achievement.id,
        code: achievement.code,
        name: achievement.name,
        description: achievement.description,
        type: achievement.type,
        xp: achievement.xp,
        completed: true,
        collected: false,
        date: new Date(),
        icone: achievement.icone,
        value: achievement.value,
      };
      this.achivementAnnonce.push({
        userId: userId.toString(),
        achievement: annonce,
      });
      await this.achievementRepository.save(userAchievement);

      // update red notif in navbar in front
      const user = await this.usersService.getUserById(userId);

      if (user && !user.notif.redAchievements)
        await this.notifRepository.update(user.notif.id, {
          redAchievements: true,
        });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async collectAchievement(
    userId: number,
    achievementId: number,
  ): Promise<void> {
    try {
      const userAchievement = await this.achievementRepository.findOne({
        where: { userId: userId },
      });
      if (!userAchievement) {
        throw new Error('User achievement not found');
      }

      const achievementProperty = `achv${achievementId}Completed`;

      if (!userAchievement[achievementProperty]) {
        throw new Error('Achievement not completed');
      } else if (userAchievement[`achv${achievementId}Collected`]) {
        throw new Error('Achievement already collected');
      } else {
        userAchievement[`achv${achievementId}Collected`] = true;
      }
      await this.achievementRepository.save(userAchievement);
      const achievement = await this.achievementDataRepository.findOne({
        where: { id: achievementId },
      });
      await this.statsService.updateXP(userId, achievement.xp);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getAllByUserId(userId: number): Promise<ReturnData> {
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
          id: userAchievements.id,
          completed: userAchievements[`achv${i + 1}Completed`],
          collected: userAchievements[`achv${i + 1}Collected`],
          date: userAchievements[`achv${i + 1}Date`],
        }),
      );

      const achievementDatas: AchievementData[] =
        await this.achievementDataRepository.find();

      if (!achievementDatas) {
        throw new Error('Achievement not found');
      }

      const userAchievement: UserAchievement[] = achievementStatus.map(
        (data, i) => ({
          id: achievementDatas[i].id,
          code: achievementDatas[i].code,
          name: achievementDatas[i].name,
          description: achievementDatas[i].description,
          type: achievementDatas[i].type,
          xp: achievementDatas[i].xp,
          completed: data.completed,
          collected: data.collected,
          date: data.date,
          icone: achievementDatas[i].icone,
          value: achievementDatas[i].value,
        }),
      );

      const fullAchievement: FullAchivement = {
        achievement: userAchievement
          .sort((a, b) => a.id - b.id)
          .sort((a, b) => {
            if (a.completed && !b.completed) return -1;
            if (!a.completed && b.completed) return 1;
            return 0;
          }),
        stats: (await this.statsService.getShortStats(userId)).data,
      };

      ret.success = true;
      ret.message = 'Achievement found';
      ret.data = fullAchievement;
      return ret;
    } catch (error) {
      console.log(error.message);
      ret.error = error.message;
      return ret;
    }
  }

  public async getLastThreeByUserId(userId: number): Promise<ReturnData> {
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
          id: userAchievements.id,
          completed: userAchievements[`achv${i + 1}Completed`],
          collected: userAchievements[`achv${i + 1}Collected`],
          date: userAchievements[`achv${i + 1}Date`],
        }),
      );

      const achievementDatas: AchievementData[] =
        await this.achievementDataRepository.find();

      if (!achievementDatas) {
        throw new Error('Achievement not found');
      }

      const lastThree: UserAchievement[] = achievementStatus.map((data, i) => ({
        id: achievementDatas[i].id,
        code: achievementDatas[i].code,
        name: achievementDatas[i].name,
        description: achievementDatas[i].description,
        type: achievementDatas[i].type,
        xp: achievementDatas[i].xp,
        completed: data.completed,
        collected: data.collected,
        date: data.date,
        icone: achievementDatas[i].icone,
        value: achievementDatas[i].value,
      }));

      ret.success = true;
      ret.message = 'Achievement found';
      ret.data = lastThree
        .filter((data) => data.completed)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);
      return ret;
    } catch (error) {
      console.log(error.message);
      ret.error = error.message;
      return ret;
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async createAchievementData(): Promise<void> {
    try {
      const achievements = await this.achievementDataRepository.find();
      if (achievements.length > 0) return;
      console.log('Creating achievements data');
      const standardAchievements: CreateAchievementDataDTO[] = [
        {
          code: 'GAME_WIN_1',
          name: 'First Blood',
          description: 'Win your first game',
          type: 'game',
          xp: 100,
          icone: 'faHandPeace',
          value: 1,
        },
        {
          code: 'GAME_WIN_10',
          name: 'Love to Win',
          description: 'Win 10 games',
          type: 'game',
          xp: 200,
          icone: 'faHandPeace',
          value: 10,
        },
        {
          code: 'GAME_WIN_100',
          name: 'Master of Win',
          description: 'Win 100 games',
          type: 'game',
          xp: 500,
          icone: 'faHandPeace',
          value: 100,
        },
        {
          code: 'GAME_WIN_1000',
          name: 'The Winner',
          description: 'Win 1000 games',
          type: 'game',
          xp: 1000,
          icone: 'faHandPeace',
          value: 1000,
        },
        {
          code: 'GAME_LOSE_1',
          name: "Next time, I'll win",
          description: 'Lose your first games',
          type: 'game',
          xp: 100,
          icone: 'faPoo',
          value: 1,
        },
        {
          code: 'GAME_LOSE_10',
          name: 'This is not my day',
          description: 'Lose 10 games',
          type: 'game',
          xp: 200,
          icone: 'faPoo',
          value: 10,
        },
        {
          code: 'GAME_LOSE_100',
          name: 'Seriously?',
          description: 'Lose 100 games',
          type: 'game',
          xp: 500,
          icone: 'faPoo',
          value: 100,
        },
        {
          code: 'GAME_LOSE_1000',
          name: 'I give up',
          description: 'Lose 1000 games',
          type: 'game',
          xp: 1000,
          icone: 'faPoo',
          value: 1000,
        },
        {
          code: 'LEAGUE_WIN_1',
          name: 'The start of a journey',
          description: 'Win your first league game',
          type: 'league',
          xp: 100,
          icone: 'faRankingStar',
          value: 1,
        },
        {
          code: 'LEAGUE_WIN_10',
          name: 'The journey continues',
          description: 'Win 10 league games',
          type: 'league',
          xp: 200,
          icone: 'faRankingStar',
          value: 10,
        },
        {
          code: 'LEAGUE_WIN_100',
          name: 'The journey is endless',
          description: 'Win 100 league games',
          type: 'league',
          xp: 500,
          icone: 'faRankingStar',
          value: 100,
        },
        {
          code: 'PARTY_WIN_1',
          name: 'Lets play my friends',
          description: 'Win your first party game',
          type: 'party',
          xp: 100,
          icone: 'faPeopleGroup',
          value: 1,
        },
        {
          code: 'PARTY_WIN_10',
          name: 'Is that all you got?',
          description: 'Win 10 party games',
          type: 'party',
          xp: 200,
          icone: 'faPeopleGroup',
          value: 10,
        },
        {
          code: 'PARTY_WIN_100',
          name: 'I am the best',
          description: 'Win 100 games party games',
          type: 'party',
          xp: 500,
          icone: 'faPeopleGroup',
          value: 100,
        },
        {
          code: 'TRAINING_WIN_1',
          name: 'Lets try this',
          description: 'Win your first training game',
          type: 'training',
          xp: 100,
          icone: 'faDumbbell',
          value: 1,
        },
        {
          code: 'TRAINING_WIN_10',
          name: 'I am getting better',
          description: 'Win 10 training games',
          type: 'training',
          xp: 200,
          icone: 'faDumbbell',
          value: 10,
        },
        {
          code: 'TRAINING_WIN_100',
          name: 'Work hard Play hard',
          description: 'Win 100 training games',
          type: 'training',
          xp: 500,
          icone: 'faDumbbell',
          value: 100,
        },
        {
          code: 'STORY_1',
          name: 'The first but not the last',
          description: 'Win the first story',
          type: 'training',
          xp: 100,
          icone: 'faScroll',
          value: 1,
        },
        {
          code: 'STORY_3',
          name: 'Just the basics',
          description: 'Win the 3rd story',
          type: 'training',
          xp: 200,
          icone: 'faScroll',
          value: 3,
        },
        {
          code: 'STORY_5',
          name: 'Only half way there',
          description: 'Win the 5th story',
          type: 'training',
          xp: 500,
          icone: 'faScroll',
          value: 5,
        },
        {
          code: 'STORY_7',
          name: 'This just got serious',
          description: 'Win the 7th story',
          type: 'training',
          xp: 500,
          icone: 'faScroll',
          value: 7,
        },
        {
          code: 'STORY_10',
          name: 'Transcendence has been achieved',
          description: 'Win the 10th story',
          type: 'training',
          xp: 1000,
          icone: 'faScroll',
          value: 10,
        },
        {
          code: 'DEMO_1',
          name: 'So that is how you do it',
          description: 'Watch a demo',
          type: 'demo',
          xp: 100,
          icone: 'faVideo',
          value: 1,
        },
        {
          code: 'DEMO_10',
          name: 'I am a fan',
          description: 'Watch 10 demos',
          type: 'demo',
          xp: 200,
          icone: 'faVideo',
          value: 10,
        },
        {
          code: 'DEMO_100',
          name: 'I am a super fan',
          description: 'Watch 100 demos',
          type: 'demo',
          xp: 500,
          icone: 'faVideo',
          value: 100,
        },
        {
          code: 'LOGIN_42',
          name: 'Embrace the darkness',
          description: 'Login with 42',
          type: 'account',
          xp: 100,
          icone: 'faGraduationCap',
        },
        {
          code: 'LOGIN_GOOGLE',
          name: 'What is up Google?',
          description: 'Login with Google',
          type: 'account',
          xp: 100,
          icone: 'faGoogle',
        },
        {
          code: 'UPLOAD_PICTURE',
          name: 'I am so beautiful',
          description: 'Upload your profile picture',
          type: 'account',
          xp: 100,
          icone: 'faCloudArrowUp',
        },
        {
          code: 'VERIFY_EMAIL',
          name: 'I am a real person',
          description: 'Verify your email',
          type: 'account',
          xp: 100,
          icone: 'faEnvelope',
        },
        {
          code: 'DOUBLE_AUTH',
          name: 'Stronger than Fort Knox',
          description: 'Enable double authentication',
          type: 'account',
          xp: 100,
          icone: 'faShieldHalved',
        },
      ];

      for (const achivement of standardAchievements) {
        await this.achievementDataRepository.save(achivement);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
