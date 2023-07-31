import { Module } from '@nestjs/common';
import { TrainingController } from './controller/training.controller';
import { TrainingService } from './service/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Training } from 'src/utils/typeorm/Training.entity';
import { ScoreService } from '@/score/service/score.service';
import { Score } from '@/utils/typeorm/Score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Training, Score])],
  controllers: [TrainingController],
  providers: [TrainingService, ScoreService],
  exports: [TrainingService],
})
export class TrainingModule {}
