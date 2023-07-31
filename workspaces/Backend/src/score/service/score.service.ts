import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '@/utils/typeorm/Score.entity';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';

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

  public async getScoreByGameId(gameId: string): Promise<ScoreInfo> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      const scoreInfo: ScoreInfo = {
        id: score.id,
        leftRound: score.leftPlayerRoundWon,
        rightRound: score.rightPlayerRoundWon,
        round: [
          {
            left: score.leftPlayerRound1,
            right: score.rightPlayerRound1,
          },
          {
            left: score.leftPlayerRound2,
            right: score.rightPlayerRound2,
          },
          {
            left: score.leftPlayerRound3,
            right: score.rightPlayerRound3,
          },
          {
            left: score.leftPlayerRound4,
            right: score.rightPlayerRound4,
          },
          {
            left: score.leftPlayerRound5,
            right: score.rightPlayerRound5,
          },
          {
            left: score.leftPlayerRound6,
            right: score.rightPlayerRound6,
          },
          {
            left: score.leftPlayerRound7,
            right: score.rightPlayerRound7,
          },
          {
            left: score.leftPlayerRound8,
            right: score.rightPlayerRound8,
          },
          {
            left: score.leftPlayerRound9,
            right: score.rightPlayerRound9,
          },
        ],
      };
      return scoreInfo;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
