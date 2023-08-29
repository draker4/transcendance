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

  public async getUserStory(userId: number): Promise<ReturnData> {
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
      const userData: UserTrainingData[] = [
        {
          levelCompleted: story.levelCompleted1,
          levelAttempted: story.levelAttempted1,
        },
        {
          levelCompleted: story.levelCompleted2,
          levelAttempted: story.levelAttempted2,
        },
        {
          levelCompleted: story.levelCompleted3,
          levelAttempted: story.levelAttempted3,
        },
        {
          levelCompleted: story.levelCompleted4,
          levelAttempted: story.levelAttempted4,
        },
        {
          levelCompleted: story.levelCompleted5,
          levelAttempted: story.levelAttempted5,
        },
        {
          levelCompleted: story.levelCompleted6,
          levelAttempted: story.levelAttempted6,
        },
        {
          levelCompleted: story.levelCompleted7,
          levelAttempted: story.levelAttempted7,
        },
        {
          levelCompleted: story.levelCompleted8,
          levelAttempted: story.levelAttempted8,
        },
        {
          levelCompleted: story.levelCompleted9,
          levelAttempted: story.levelAttempted9,
        },
        {
          levelCompleted: story.levelCompleted10,
          levelAttempted: story.levelAttempted10,
        },
      ];
      const storyDatas: StoryData[] = await this.storyDataRepository.find();
      if (storyDatas.length === 0) {
        await this.createStoryData();
      }
      let userStories: UserStory[];
      for (let i = 0; i < 10; i++) {
        const userStory: UserStory = {
          level: i + 1,
          levelCompleted: userData[0].levelCompleted,
          levelAttempted: userData[0].levelAttempted,
          name: storyDatas[i].name,
          maxPoint: storyDatas[i].maxPoint,
          maxRound: storyDatas[i].maxRound,
          difficulty: storyDatas[i].difficulty,
          push: storyDatas[i].push,
          pause: storyDatas[i].pause,
          background: storyDatas[i].background,
          ball: storyDatas[i].ball,
        };
        userStories.push(userStory);
      }
      ret.success = true;
      ret.message = 'Story found';
      ret.data = userStories;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private async createStoryData(): Promise<void> {
    try {
      const story1: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story1);
      const story2: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story2);
      const story3: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story3);
      const story4: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story4);
      const story5: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story5);
      const story6: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story6);
      const story7: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story7);
      const story8: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story8);
      const story9: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story9);
      const story10: CreateStoryDataDTO = {
        name: 'Want to Be the First',
        maxPoint: 5,
        maxRound: 1,
        difficulty: -2,
        push: false,
        pause: false,
        background: 'Classic',
        ball: 'Classic',
      };
      await this.storyDataRepository.save(story10);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
