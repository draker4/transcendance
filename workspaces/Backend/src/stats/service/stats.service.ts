import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { CreateStatsDTO } from '../dto/CreateStats.dto';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';

@Injectable()
export class StatsService {
  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}

  // --------------------------------  PUBLIC METHODS  -------------------------------- //

  public async createStats(newStats: CreateStatsDTO): Promise<Stats> {
    try {
      const stats = await this.statsRepository.save(newStats);
      return stats;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateStats(
    userId: number,
    type: 'League' | 'Party' | 'Training',
    side: 'Left' | 'Right',
    score: ScoreInfo,
  ): Promise<Stats> {
    try {
      let stats = await this.statsRepository.findOne({
        where: { userId: userId },
      });
      if (!stats) {
        throw new Error('Stats not found');
      }
      const nbRound = score.leftRound + score.rightRound;
      if (type === 'League') {
        stats = this.defineLeagueStats(stats, side, score, nbRound);
      } else if (type === 'Party') {
        stats = this.definePartyStats(stats, side, score, nbRound);
      } else if (type === 'Training') {
        stats = this.defineTrainingStats(stats, side, score, nbRound);
      }
      return await this.statsRepository.save(stats);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getStatsByUserId(userId: number): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const stats = await this.statsRepository.findOne({
        where: { userId: userId },
      });
      if (!stats) {
        ret.message = 'Stats not found';
        return ret;
      }
      ret.success = true;
      ret.message = 'Stats found';
      ret.data = stats;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  // --------------------------------  PRIVATE METHODS  ------------------------------- //

  private defineLeagueStats(
    stats: Stats,
    side: 'Left' | 'Right',
    score: ScoreInfo,
    nbRound: number,
  ): Stats {
    stats.leagueGamePlayed += 1;
    if (score.leftRound > score.rightRound) {
      if (side === 'Left') stats.leagueGameWon += 1;
      else stats.leagueGameLost += 1;
    } else {
      if (side === 'Left') stats.leagueGameLost += 1;
      else stats.leagueGameWon += 1;
    }
    stats.leagueRoundPlayed += nbRound;
    stats.leagueRoundWon +=
      side === 'Left' ? score.leftRound : score.rightRound;
    stats.leagueRoundLost +=
      side === 'Left' ? score.rightRound : score.leftRound;
    let nbPoint = 0;
    let leftPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      nbPoint = score.round[i].left + score.round[i].right;
      leftPointWin = score.round[i].left;
    }
    stats.leaguePointPlayed += nbPoint;
    stats.leaguePointWon +=
      side === 'Left' ? leftPointWin : nbPoint - leftPointWin;
    stats.leaguePointLost +=
      side === 'Left' ? nbPoint - leftPointWin : leftPointWin;
    return stats;
  }

  private definePartyStats(
    stats: Stats,
    side: 'Left' | 'Right',
    score: ScoreInfo,
    nbRound: number,
  ): Stats {
    stats.partyGamePlayed += 1;
    if (score.leftRound > score.rightRound) {
      if (side === 'Left') stats.partyGameWon += 1;
      else stats.partyGameLost += 1;
    }
    if (score.leftRound < score.rightRound) {
      if (side === 'Left') stats.partyGameLost += 1;
      else stats.partyGameWon += 1;
    }
    stats.partyRoundPlayed += nbRound;
    stats.partyRoundWon += side === 'Left' ? score.leftRound : score.rightRound;
    stats.partyRoundLost +=
      side === 'Left' ? score.rightRound : score.leftRound;
    let nbPoint = 0;
    let leftPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      nbPoint = score.round[i].left + score.round[i].right;
      leftPointWin = score.round[i].left;
    }
    stats.partyPointPlayed += nbPoint;
    stats.partyPointWon +=
      side === 'Left' ? leftPointWin : nbPoint - leftPointWin;
    stats.partyPointLost +=
      side === 'Left' ? nbPoint - leftPointWin : leftPointWin;
    return stats;
  }

  private defineTrainingStats(
    stats: Stats,
    side: 'Left' | 'Right',
    score: ScoreInfo,
    nbRound: number,
  ) {
    stats.trainingGamePlayed += 1;
    if (score.leftRound > score.rightRound) {
      if (side === 'Left') stats.trainingGameWon += 1;
      else stats.trainingGameLost += 1;
    }
    if (score.leftRound < score.rightRound) {
      if (side === 'Left') stats.trainingGameLost += 1;
      else stats.trainingGameWon += 1;
    }
    stats.trainingRoundPlayed += nbRound;
    stats.trainingRoundWon +=
      side === 'Left' ? score.leftRound : score.rightRound;
    stats.trainingRoundLost +=
      side === 'Left' ? score.rightRound : score.leftRound;
    let nbPoint = 0;
    let leftPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      nbPoint = score.round[i].left + score.round[i].right;
      leftPointWin = score.round[i].left;
    }
    stats.trainingPointPlayed += nbPoint;
    stats.trainingPointWon +=
      side === 'Left' ? leftPointWin : nbPoint - leftPointWin;
    stats.trainingPointLost +=
      side === 'Left' ? nbPoint - leftPointWin : leftPointWin;
    return stats;
  }
}
