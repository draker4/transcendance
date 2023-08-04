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

  public async addOpponent(gameId: string, opponentId: number): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      if (score.leftPlayerId === -1) {
        console.log('Add Player to left Score');
        score.leftPlayerId = opponentId;
      } else if (score.rightPlayerId === -1) {
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
      };
      return scoreInfo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateScore(
    gameId: string,
    scoreInfo: ScoreInfo,
    actualRound: number,
    changeRound: boolean,
  ): Promise<void> {
    try {
      const score = await this.scoreRepository.findOne({
        where: { gameId: gameId },
      });
      if (!score) {
        throw new Error('Score not found');
      }
      if (changeRound) {
        score.leftPlayerRoundWon = scoreInfo.leftRound;
        score.rightPlayerRoundWon = scoreInfo.rightRound;
        actualRound--;
      }
      switch (actualRound) {
        case 0:
          score.leftPlayerRound1 = scoreInfo.round[0].left;
          score.rightPlayerRound1 = scoreInfo.round[0].right;
          break;
        case 1:
          score.leftPlayerRound2 = scoreInfo.round[1].left;
          score.rightPlayerRound2 = scoreInfo.round[1].right;
          break;
        case 2:
          score.leftPlayerRound3 = scoreInfo.round[2].left;
          score.rightPlayerRound3 = scoreInfo.round[2].right;
          break;
        case 3:
          score.leftPlayerRound4 = scoreInfo.round[3].left;
          score.rightPlayerRound4 = scoreInfo.round[3].right;
          break;
        case 4:
          score.leftPlayerRound5 = scoreInfo.round[4].left;
          score.rightPlayerRound5 = scoreInfo.round[4].right;
          break;
        case 5:
          score.leftPlayerRound6 = scoreInfo.round[5].left;
          score.rightPlayerRound6 = scoreInfo.round[5].right;
          break;
        case 6:
          score.leftPlayerRound7 = scoreInfo.round[6].left;
          score.rightPlayerRound7 = scoreInfo.round[6].right;
          break;
        case 7:
          score.leftPlayerRound8 = scoreInfo.round[7].left;
          score.rightPlayerRound8 = scoreInfo.round[7].right;
          break;
        case 8:
          score.leftPlayerRound9 = scoreInfo.round[8].left;
          score.rightPlayerRound9 = scoreInfo.round[8].right;
      }
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
