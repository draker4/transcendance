import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { CreateStatsDTO } from '../dto/CreateStats.dto';
import { ScoreInfo } from '@transcendence/shared/types/Score.types';
import {
  ResumeStats,
  StatsImproved,
  Result,
  XP,
} from '@transcendence/shared/types/Stats.types';
import { UpdateStatsDTO } from '../dto/UpdateStats.dto';
import { calculateXP } from '@transcendence/shared/game/calculateXP';

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
    update: UpdateStatsDTO,
  ): Promise<Stats> {
    try {
      let stats = await this.statsRepository.findOne({
        where: { userId: userId },
      });
      if (!stats) {
        throw new Error('Stats not found');
      }
      const result: Result = {
        win: false,
        rageQuit: false,
        roundWin: 0,
        roundLost: 0,
        pointWin: 0,
        pointLost: 0,
      };
      if (update.mode === 'League') {
        stats = this.defineLeagueStats(
          stats,
          update.side,
          update.type,
          update.score,
          update.nbRound,
          result,
        );
      } else if (update.mode === 'Party') {
        stats = this.definePartyStats(
          stats,
          update.side,
          update.type,
          update.score,
          update.nbRound,
          result,
        );
      } else if (update.mode === 'Training') {
        stats = this.defineTrainingStats(
          stats,
          update.side,
          update.type,
          update.score,
          update.nbRound,
          result,
        );
      }
      const xp: XP = calculateXP(result, update.maxPoint);
      if (update.mode === 'League') {
        stats.leagueXP += xp.total;
        if (stats.leagueXP < 0) stats.leagueXP = 0;
      }
      if (result.win) {
        stats.playerXP += xp.total;
      }
      return await this.statsRepository.save(stats);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getResumeStats(userId: number): Promise<ReturnData> {
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
      const resumeStats: ResumeStats = {
        userId: stats.userId,
        leagueXp: stats.leagueXP,
        playerXp: stats.playerXP,
        gameWon: 0,
        gameLost: 0,
        leagueWon:
          stats.leagueClassicWon + stats.leagueBest3Won + stats.leagueBest5Won,
        leagueLost:
          stats.leagueClassicLost +
          stats.leagueBest3Lost +
          stats.leagueBest5Lost,
        partyWon:
          stats.partyClassicWon +
          stats.partyBest3Won +
          stats.partyBest5Won +
          stats.partyCustomWon,
        partyLost:
          stats.partyClassicLost +
          stats.partyBest3Lost +
          stats.partyBest5Lost +
          stats.partyCustomLost,
        trainingWon:
          stats.trainingClassicWon +
          stats.trainingBest3Won +
          stats.trainingBest5Won +
          stats.trainingCustomWon +
          stats.trainingStoryWon,
        trainingLost:
          stats.trainingClassicLost +
          stats.trainingBest3Lost +
          stats.trainingBest5Lost +
          stats.trainingCustomLost +
          stats.trainingStoryLost,
      };
      resumeStats.gameWon =
        resumeStats.leagueWon + resumeStats.partyWon + resumeStats.trainingWon;
      resumeStats.gameLost =
        resumeStats.leagueLost +
        resumeStats.partyLost +
        resumeStats.trainingLost;
      ret.data = resumeStats;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  public async getAllResumeStats(): Promise<ReturnData> {
    const ret: ReturnData = {
      success: false,
      message: 'Catched an error',
    };
    try {
      const stats = await this.statsRepository.find();
      if (!stats) {
        ret.message = 'Stats not found';
        return ret;
      }
      ret.success = true;
      ret.message = 'Stats found';
      const resumeStats: ResumeStats[] = [];
      for (const stat of stats) {
        const resumeStat: ResumeStats = {
          userId: stat.userId,
          leagueXp: stat.leagueXP,
          playerXp: stat.playerXP,
          gameWon: 0,
          gameLost: 0,
          leagueWon:
            stat.leagueClassicWon + stat.leagueBest3Won + stat.leagueBest5Won,
          leagueLost:
            stat.leagueClassicLost +
            stat.leagueBest3Lost +
            stat.leagueBest5Lost,
          partyWon:
            stat.partyClassicWon +
            stat.partyBest3Won +
            stat.partyBest5Won +
            stat.partyCustomWon,
          partyLost:
            stat.partyClassicLost +
            stat.partyBest3Lost +
            stat.partyBest5Lost +
            stat.partyCustomLost,
          trainingWon:
            stat.trainingClassicWon +
            stat.trainingBest3Won +
            stat.trainingBest5Won +
            stat.trainingCustomWon +
            stat.trainingStoryWon,
          trainingLost:
            stat.trainingClassicLost +
            stat.trainingBest3Lost +
            stat.trainingBest5Lost +
            stat.trainingCustomLost +
            stat.trainingStoryLost,
        };
        resumeStat.gameWon =
          resumeStat.leagueWon + resumeStat.partyWon + resumeStat.trainingWon;
        resumeStat.gameLost =
          resumeStat.leagueLost +
          resumeStat.partyLost +
          resumeStat.trainingLost;
        resumeStats.push(resumeStat);
      }
      ret.data = resumeStats;
      return ret;
    } catch (error) {
      ret.error = error;
      return ret;
    }
  }

  public async getFullStats(userId: number): Promise<ReturnData> {
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
      const statsImproved: StatsImproved = {
        statsDB: stats,
        gameWon: 0,
        gameLost: 0,
        classicWon:
          stats.leagueClassicWon +
          stats.partyClassicWon +
          stats.trainingClassicWon,
        classicLost:
          stats.leagueClassicLost +
          stats.partyClassicLost +
          stats.trainingClassicLost,
        best3Won:
          stats.leagueBest3Won + stats.partyBest3Won + stats.trainingBest3Won,
        best3Lost:
          stats.leagueBest3Lost +
          stats.partyBest3Lost +
          stats.trainingBest3Lost,
        best5Won:
          stats.leagueBest5Won + stats.partyBest5Won + stats.trainingBest5Won,
        best5Lost:
          stats.leagueBest5Lost +
          stats.partyBest5Lost +
          stats.trainingBest5Lost,
        customWon: stats.partyCustomWon + stats.trainingCustomWon,
        customLost: stats.partyCustomLost + stats.trainingCustomLost,
        storyWon: stats.trainingStoryWon,
        storyLost: stats.trainingStoryLost,
        rageQuitWin: stats.leagueRageQuitWin + stats.partyRageQuitWin,
        rageQuitLost: stats.leagueRageQuitLost + stats.partyRageQuitLost,
        disconnectWin: stats.leagueDisconnectWin + stats.partyDisconnectWin,
        disconnectLost: stats.leagueDisconnectLost + stats.partyDisconnectLost,
        roundWon:
          stats.leagueRoundWon + stats.partyRoundWon + stats.trainingRoundWon,
        roundLost:
          stats.leagueRoundLost +
          stats.partyRoundLost +
          stats.trainingRoundLost,
        pointWon:
          stats.leaguePointWon + stats.partyPointWon + stats.trainingPointWon,
        pointLost:
          stats.leaguePointLost +
          stats.partyPointLost +
          stats.trainingPointLost,
      };
      statsImproved.gameWon =
        statsImproved.classicWon +
        statsImproved.best3Won +
        statsImproved.best5Won +
        statsImproved.customWon;
      statsImproved.gameLost =
        statsImproved.classicLost +
        statsImproved.best3Lost +
        statsImproved.best5Lost +
        statsImproved.customLost;
      ret.data = statsImproved;
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
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Story',
    score: ScoreInfo,
    nbRound: number,
    result: Result,
  ): Stats {
    if (score.leftRound > score.rightRound) {
      if (side === 'Left') {
        if (type === 'Classic') stats.leagueClassicWon += 1;
        else if (type === 'Best3') stats.leagueBest3Won += 1;
        else if (type === 'Best5') stats.leagueBest5Won += 1;
        result.win = true;
      } else {
        if (type === 'Classic') stats.leagueClassicLost += 1;
        else if (type === 'Best3') stats.leagueBest3Lost += 1;
        else if (type === 'Best5') stats.leagueBest5Lost += 1;
      }
    } else {
      if (side === 'Left') {
        if (type === 'Classic') stats.leagueClassicLost += 1;
        else if (type === 'Best3') stats.leagueBest3Lost += 1;
        else if (type === 'Best5') stats.leagueBest5Lost += 1;
      } else {
        if (type === 'Classic') stats.leagueClassicWon += 1;
        else if (type === 'Best3') stats.leagueBest3Won += 1;
        else if (type === 'Best5') stats.leagueBest5Won += 1;
        result.win = true;
      }
    }
    if (score.rageQuit) {
      if (side === score.rageQuit) stats.leagueRageQuitLost += 1;
      else stats.leagueRageQuitWin += 1;
      result.rageQuit = true;
    }
    result.roundWin = side === 'Left' ? score.leftRound : score.rightRound;
    result.roundLost = side === 'Left' ? score.rightRound : score.leftRound;
    stats.leagueRoundWon += result.roundWin;
    stats.leagueRoundLost += result.roundLost;
    let leftPointWin = 0;
    let rightPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      leftPointWin += score.round[i].left;
      rightPointWin += score.round[i].right;
    }
    result.pointWin = side === 'Left' ? leftPointWin : rightPointWin;
    result.pointLost = side === 'Left' ? rightPointWin : leftPointWin;
    stats.leaguePointWon += result.pointWin;
    stats.leaguePointLost += result.pointLost;
    return stats;
  }

  private definePartyStats(
    stats: Stats,
    side: 'Left' | 'Right',
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Story',
    score: ScoreInfo,
    nbRound: number,
    result: Result,
  ): Stats {
    if (
      score.rageQuit === 'Right' ||
      score.disconnect === 'Right' ||
      (score.leftRound > score.rightRound &&
        !score.rageQuit &&
        !score.disconnect)
    ) {
      if (side === 'Left') {
        if (type === 'Classic') stats.partyClassicWon += 1;
        else if (type === 'Best3') stats.partyBest3Won += 1;
        else if (type === 'Best5') stats.partyBest5Won += 1;
        else if (type === 'Custom') stats.partyCustomWon += 1;
        result.win = true;
      } else {
        if (type === 'Classic') stats.partyClassicLost += 1;
        else if (type === 'Best3') stats.partyBest3Lost += 1;
        else if (type === 'Best5') stats.partyBest5Lost += 1;
        else if (type === 'Custom') stats.partyCustomLost += 1;
      }
    } else if (
      score.rageQuit === 'Left' ||
      score.disconnect === 'Left' ||
      (score.leftRound < score.rightRound &&
        !score.rageQuit &&
        !score.disconnect)
    ) {
      if (side === 'Left') {
        if (type === 'Classic') stats.partyClassicLost += 1;
        else if (type === 'Best3') stats.partyBest3Lost += 1;
        else if (type === 'Best5') stats.partyBest5Lost += 1;
        else if (type === 'Custom') stats.partyCustomLost += 1;
      } else {
        if (type === 'Classic') stats.partyClassicWon += 1;
        else if (type === 'Best3') stats.partyBest3Won += 1;
        else if (type === 'Best5') stats.partyBest5Won += 1;
        else if (type === 'Custom') stats.partyCustomWon += 1;
        result.win = true;
      }
    }
    if (score.rageQuit) {
      if (side === score.rageQuit) stats.partyRageQuitLost += 1;
      else stats.partyRageQuitWin += 1;
      result.rageQuit = true;
    } else if (score.disconnect) {
      if (side === score.disconnect) stats.partyDisconnectLost += 1;
      else stats.partyDisconnectWin += 1;
    }
    result.roundWin = side === 'Left' ? score.leftRound : score.rightRound;
    result.roundLost = side === 'Left' ? score.rightRound : score.leftRound;
    stats.partyRoundWon += result.roundWin;
    stats.partyRoundLost += result.roundLost;
    let leftPointWin = 0;
    let rightPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      leftPointWin += score.round[i].left;
      rightPointWin += score.round[i].right;
    }
    result.pointWin = side === 'Left' ? leftPointWin : rightPointWin;
    result.pointLost = side === 'Left' ? rightPointWin : leftPointWin;
    stats.partyPointWon += result.pointWin;
    stats.partyPointLost += result.pointLost;
    return stats;
  }

  private defineTrainingStats(
    stats: Stats,
    side: 'Left' | 'Right',
    type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Story',
    score: ScoreInfo,
    nbRound: number,
    result: Result,
  ) {
    if (score.leftRound > score.rightRound) {
      if (side === 'Left') {
        if (type === 'Classic') stats.trainingClassicWon += 1;
        else if (type === 'Best3') stats.trainingBest3Won += 1;
        else if (type === 'Best5') stats.trainingBest5Won += 1;
        else if (type === 'Custom') stats.trainingCustomWon += 1;
        else if (type === 'Story') stats.trainingStoryWon += 1;
        result.win = true;
      } else {
        if (type === 'Classic') stats.trainingClassicLost += 1;
        else if (type === 'Best3') stats.trainingBest3Lost += 1;
        else if (type === 'Best5') stats.trainingBest5Lost += 1;
        else if (type === 'Custom') stats.trainingCustomLost += 1;
        else if (type === 'Story') stats.trainingStoryLost += 1;
      }
    } else {
      if (side === 'Left') {
        if (type === 'Classic') stats.trainingClassicLost += 1;
        else if (type === 'Best3') stats.trainingBest3Lost += 1;
        else if (type === 'Best5') stats.trainingBest5Lost += 1;
        else if (type === 'Custom') stats.trainingCustomLost += 1;
        else if (type === 'Story') stats.trainingStoryLost += 1;
      } else {
        if (type === 'Classic') stats.trainingClassicWon += 1;
        else if (type === 'Best3') stats.trainingBest3Won += 1;
        else if (type === 'Best5') stats.trainingBest5Won += 1;
        else if (type === 'Custom') stats.trainingCustomWon += 1;
        else if (type === 'Story') stats.trainingStoryWon += 1;
        result.win = true;
      }
    }
    result.roundWin = side === 'Left' ? score.leftRound : score.rightRound;
    result.roundLost = side === 'Left' ? score.rightRound : score.leftRound;
    stats.trainingRoundWon += result.roundWin;
    stats.trainingRoundLost += result.roundLost;
    let leftPointWin = 0;
    let rightPointWin = 0;
    for (let i = 0; i < nbRound; i++) {
      leftPointWin += score.round[i].left;
      rightPointWin += score.round[i].right;
    }
    result.pointWin = side === 'Left' ? leftPointWin : rightPointWin;
    result.pointLost = side === 'Left' ? rightPointWin : leftPointWin;
    return stats;
  }
}
