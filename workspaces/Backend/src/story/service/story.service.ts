import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { CreateStoryDTO } from '@/story/dto/CreateStory.dto';
import { UpdateStoryDTO } from '@/story/dto/UpdateStory.dto';
import { CreateStoryDataDTO } from '../dto/CreateStoryData.dto';
import {
  UserStory,
  UserTrainingData,
} from '@transcendence/shared/types/Story.types';

@Injectable()
export class StoryService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(StoryData)
    private readonly storyDataRepository: Repository<StoryData>,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async createStory(newStory: CreateStoryDTO): Promise<Story> {
    try {
      const story = await this.storyRepository.save(newStory);
      return story;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateStory(
    userId: number,
    update: UpdateStoryDTO,
  ): Promise<Story> {
    try {
      const story = await this.storyRepository.findOne({
        where: { userId: userId },
      });
      if (!story) {
        throw new Error('Story not found');
      }
      switch (update.level) {
        case 1:
          if (update.completed) story.levelCompleted1 = update.completed;
          story.levelAttempted1++;
          break;
        case 2:
          if (update.completed) story.levelCompleted2 = update.completed;
          story.levelAttempted2++;
          break;
        case 3:
          if (update.completed) story.levelCompleted3 = update.completed;
          story.levelAttempted3++;
          break;
        case 4:
          if (update.completed) story.levelCompleted4 = update.completed;
          story.levelAttempted4++;
          break;
        case 5:
          if (update.completed) story.levelCompleted5 = update.completed;
          story.levelAttempted5++;
          break;
        case 6:
          if (update.completed) story.levelCompleted6 = update.completed;
          story.levelAttempted6++;
          break;
        case 7:
          if (update.completed) story.levelCompleted7 = update.completed;
          story.levelAttempted7++;
          break;
        case 8:
          if (update.completed) story.levelCompleted8 = update.completed;
          story.levelAttempted8++;
          break;
        case 9:
          if (update.completed) story.levelCompleted9 = update.completed;
          story.levelAttempted9++;
          break;
        case 10:
          if (update.completed) story.levelCompleted10 = update.completed;
          story.levelAttempted10++;
          break;
        default:
          break;
      }
      return await this.storyRepository.save(story);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getUserStories(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const story = await this.storyRepository.findOne({
        where: { userId: userId },
      });

      if (!story) {
        ret.message = 'Story not found';
        return ret;
      }

      const userData: UserTrainingData[] = Array.from(
        { length: 10 },
        (_, i) => ({
          levelCompleted: story[`levelCompleted${i + 1}`],
          levelAttempted: story[`levelAttempted${i + 1}`],
        }),
      );

      let storyDatas: StoryData[] = await this.storyDataRepository.find();

      if (!storyDatas || storyDatas.length === 0) {
        await this.createStoryData();
        storyDatas = await this.storyDataRepository.find();

        if (!storyDatas || storyDatas.length === 0) {
          ret.message = 'cannot create story';
          return ret;
        }
      }
      storyDatas.sort((a, b) => a.level - b.level);

      const userStories: UserStory[] = userData.map((data, i) => ({
        level: storyDatas[i].level,
        levelCompleted: data.levelCompleted,
        levelAttempted: data.levelAttempted,
        name: storyDatas[i].name,
        maxPoint: storyDatas[i].maxPoint,
        maxRound: storyDatas[i].maxRound,
        difficulty: storyDatas[i].difficulty,
        push: storyDatas[i].push,
        pause: storyDatas[i].pause,
        background: storyDatas[i].background,
        ball: storyDatas[i].ball,
      }));

      ret.success = true;
      ret.message = 'Story found';
      ret.data = userStories;
      return ret;
    } catch (error) {
      ret.error = error.message;
      return ret;
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async createStoryData(): Promise<void> {
    try {
      const levels: CreateStoryDataDTO[] = [
        {
          level: 1,
          name: 'Want Be First',
          maxPoint: 5,
          maxRound: 1,
          difficulty: -2,
          push: false,
          pause: false,
          background: 'Classic',
          ball: 'Volley1',
        },
        {
          level: 2,
          name: 'El Classico',
          maxPoint: 9,
          maxRound: 1,
          difficulty: -2,
          push: false,
          pause: false,
          background: 'Classic',
          ball: 'Classic',
        },
        {
          level: 3,
          name: 'Round Up The Pause',
          maxPoint: 3,
          maxRound: 3,
          difficulty: -1,
          push: false,
          pause: true,
          background: 'Earth',
          ball: 'Basket',
        },
        {
          level: 4,
          name: `Let's Push`,
          maxPoint: 5,
          maxRound: 3,
          difficulty: -1,
          push: true,
          pause: true,
          background: 'Island',
          ball: 'Football4',
        },
        {
          level: 5,
          name: 'Best Three',
          maxPoint: 7,
          maxRound: 3,
          difficulty: 0,
          push: true,
          pause: true,
          background: 'Winter',
          ball: 'Bowling2',
        },
        {
          level: 6,
          name: 'Best Five',
          maxPoint: 5,
          maxRound: 5,
          difficulty: 0,
          push: true,
          pause: true,
          background: 'Tennis',
          ball: 'Volley2',
        },
        {
          level: 7,
          name: 'Rising Challenge',
          maxPoint: 5,
          maxRound: 7,
          difficulty: 1,
          push: false,
          pause: true,
          background: 'Random',
          ball: 'Random',
        },
        {
          level: 8,
          name: 'Advanced Struggle',
          maxPoint: 3,
          maxRound: 9,
          difficulty: 1,
          push: true,
          pause: true,
          background: 'Football',
          ball: 'Football2',
        },
        {
          level: 9,
          name: 'Masterful Test',
          maxPoint: 9,
          maxRound: 5,
          difficulty: 2,
          push: true,
          pause: true,
          background: 'Rugby',
          ball: 'Rugby',
        },
        {
          level: 10,
          name: 'Transcendence',
          maxPoint: 9,
          maxRound: 9,
          difficulty: 2,
          push: false,
          pause: false,
          background: 'Random',
          ball: 'Random',
        },
      ];

      for (const level of levels) {
        await this.storyDataRepository.save(level);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
