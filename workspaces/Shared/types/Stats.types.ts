import { ScoreInfo } from "./Score.types";

export type Stats = {
  // Global
  id: number;
  leagueXP: number;
  playerXP: number;

  // League stats
  leagueClassicWon: number;
  leagueClassicLost: number;
  leagueBest3Won: number;
  leagueBest3Lost: number;
  leagueBest5Won: number;
  leagueBest5Lost: number;
  leagueRageQuitWin: number;
  leagueRageQuitLost: number;
  leagueDisconnectWin: number;
  leagueDisconnectLost: number;
  leagueRoundWon: number;
  leagueRoundLost: number;
  leaguePointWon: number;
  leaguePointLost: number;

  // Party stats
  partyClassicWon: number;
  partyClassicLost: number;
  partyBest3Won: number;
  partyBest3Lost: number;
  partyBest5Won: number;
  partyBest5Lost: number;
  partyCustomWon: number;
  partyCustomLost: number;
  partyRageQuitWin: number;
  partyRageQuitLost: number;
  partyDisconnectWin: number;
  partyDisconnectLost: number;
  partyRoundWon: number;
  partyRoundLost: number;
  partyPointWon: number;
  partyPointLost: number;

  // Training stats
  trainingClassicWon: number;
  trainingClassicLost: number;
  trainingBest3Won: number;
  trainingBest3Lost: number;
  trainingBest5Won: number;
  trainingBest5Lost: number;
  trainingRoundWon: number;
  trainingRoundLost: number;
  trainingPointWon: number;
  trainingPointLost: number;
};

export type StatsImproved = {
  statsDB: Stats;
  gameWon: number;
  gameLost: number;
  classicWon: number;
  classicLost: number;
  best3Won: number;
  best3Lost: number;
  best5Won: number;
  best5Lost: number;
  customWon: number;
  customLost: number;
  storyWon: number;
  storyLost: number;
  rageQuitWin: number;
  rageQuitLost: number;
  disconnectWin: number;
  disconnectLost: number;
  roundWon: number;
  roundLost: number;
  pointWon: number;
  pointLost: number;
};

export type StatsUpdate = {
  type: "Classic" | "Best3" | "Best5" | "Custom" | "Story";
  mode: "League" | "Party" | "Training";
  side: "Left" | "Right";
  score: ScoreInfo;
  nbRound: number;
};
