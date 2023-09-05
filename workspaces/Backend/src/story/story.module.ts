import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryService } from './service/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, AchievementData, Story, StoryData]),
  ],
  controllers: [StoryController],
  providers: [AchievementService, StoryService],
  exports: [StoryService],
})
export class StoryModule {}
