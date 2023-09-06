import { Module } from '@nestjs/common';
import { AchievementService } from './service/achievement.service';
import { AchievementController } from './controller/achievement.controller';
import { Achievement } from '@/utils/typeorm/Achievement.entity';
import { AchievementData } from '@/utils/typeorm/AchievementData.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsModule } from '@/stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, AchievementData]),
    StatsModule,
  ],
  providers: [AchievementService],
  controllers: [AchievementController],
  exports: [AchievementService],
})
export class AchievementModule {}
