import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from '@/utils/typeorm/Score.entity';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';

import { CreateScoreDTO } from '@/score/dto/CreateScore.dto';
import { UpdateScoreDTO } from '@/score/dto/UpdateScore.dto';
import { UpdatePauseDTO } from '@/score/dto/UpdatePause.dto';

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

  public async addOpponent(gameId: string, opponentId: number): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      if (score.leftPlayerId === -1) {
        if (
          process.env &&
          process.env.ENVIRONNEMENT &&
          process.env.ENVIRONNEMENT === 'dev'
        )
          console.log('Add Player to left Score');
        score.leftPlayerId = opponentId;
      } else if (score.rightPlayerId === -1) {
        if (
          process.env &&
          process.env.ENVIRONNEMENT &&
          process.env.ENVIRONNEMENT === 'dev'
        )
          console.log('Add Player to right Score');
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
        rageQuit: '',
        disconnect: '',
        leftPause: score.leftPause,
        rightPause: score.rightPause,
      };
      return scoreInfo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateScore(
    gameId: string,
    scoreInfo: UpdateScoreDTO,
  ): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      score.leftPlayerRoundWon = scoreInfo.leftRound;
      score.rightPlayerRoundWon = scoreInfo.rightRound;
      switch (scoreInfo.actualRound) {
        case 0:
          score.leftPlayerRound1 = scoreInfo.left;
          score.rightPlayerRound1 = scoreInfo.right;
          break;
        case 1:
          score.leftPlayerRound2 = scoreInfo.left;
          score.rightPlayerRound2 = scoreInfo.right;
          break;
        case 2:
          score.leftPlayerRound3 = scoreInfo.left;
          score.rightPlayerRound3 = scoreInfo.right;
          break;
        case 3:
          score.leftPlayerRound4 = scoreInfo.left;
          score.rightPlayerRound4 = scoreInfo.right;
          break;
        case 4:
          score.leftPlayerRound5 = scoreInfo.left;
          score.rightPlayerRound5 = scoreInfo.right;
          break;
        case 5:
          score.leftPlayerRound6 = scoreInfo.left;
          score.rightPlayerRound6 = scoreInfo.right;
          break;
        case 6:
          score.leftPlayerRound7 = scoreInfo.left;
          score.rightPlayerRound7 = scoreInfo.right;
          break;
        case 7:
          score.leftPlayerRound8 = scoreInfo.left;
          score.rightPlayerRound8 = scoreInfo.right;
          break;
        case 8:
          score.leftPlayerRound9 = scoreInfo.left;
          score.rightPlayerRound9 = scoreInfo.right;
          break;
      }
      await this.scoreRepository.save(score);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updatePause(
    gameId: string,
    pauseInfo: UpdatePauseDTO,
  ): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      score.leftPause = pauseInfo.left;
      score.rightPause = pauseInfo.right;
      await this.scoreRepository.save(score);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateRageQuit(
    gameId: string,
    rageQuit: 'Left' | 'Right',
  ): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      score.rageQuit = rageQuit;
      await this.scoreRepository.save(score);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
