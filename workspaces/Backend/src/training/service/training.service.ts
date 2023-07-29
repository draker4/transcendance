import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Training } from 'src/utils/typeorm/Training.entity';

import { ScoreService } from '@/score/service/score.service';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,

    private readonly scoreService: ScoreService,
  ) {}
}
