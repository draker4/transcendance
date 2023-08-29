import { Module } from '@nestjs/common';
import { StoryController } from './controller/story.controller';
import { StoryService } from './story/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '@/utils/typeorm/Story.entity';
import { StoryData } from '@/utils/typeorm/StoryData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Story, StoryData])],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
