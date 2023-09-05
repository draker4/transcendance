import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryService } from './service/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';
import { AchievementModule } from '@/achievement/achievement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story, StoryData]), AchievementModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
