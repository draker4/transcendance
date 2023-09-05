import { Module } from '@nestjs/common';
import { StatsController } from './controller/stats.controller';
import { StatsService } from './service/stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'src/utils/typeorm/Stats.entity';
import { ExperienceService } from '@/experience/service/experience.service';
import { ExperienceData } from '@/utils/typeorm/ExperienceData.entity';
import { AchievementService } from '@/achievement/service/achievement.service';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { Achievement } from '@/utils/typeorm/Achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Achievement,
      AchievementData,
      ExperienceData,
      Stats,
    ]),
  ],
  controllers: [StatsController],
  providers: [AchievementService, ExperienceService, StatsService],
  exports: [StatsService],
})
export class StatsModule {}
