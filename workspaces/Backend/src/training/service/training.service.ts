import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Training } from 'src/utils/typeorm/Training.entity';

import { User } from 'src/utils/typeorm/User.entity';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Training)
    private readonly trainingRepository: Repository<Training>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
