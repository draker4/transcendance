import { Module } from '@nestjs/common';
import { TrainingController } from './controller/training.controller';
import { TrainingService } from './service/training.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { Training } from 'src/utils/typeorm/Training.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Training]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
