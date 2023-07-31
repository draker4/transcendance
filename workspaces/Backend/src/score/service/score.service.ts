import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '@/utils/typeorm/Score.entity';

import { CreateScoreDTO } from '@/score/dto/CreateScore.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}
  public async createScore(newScore: CreateScoreDTO): Promise<Score> {
    try {
      const score = await this.scoreRepository.save(newScore);
      return score;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async addOpponent(scoreId: string, opponentId: number): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { id: scoreId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      if (score.leftPlayerId === -1) {
        score.leftPlayerId = opponentId;
      } else if (score.rightPlayerId === -1) {
        score.rightPlayerId = opponentId;
      } else {
        throw new Error('Both players already defined');
      }
      await this.scoreRepository.save(score);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
