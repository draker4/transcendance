interface League {
  Top10: PlayerLeaderBoard[];
  AllRanked: GameRanked[];
}

interface PlayerLeaderBoard {
  login: string;
  score: number;
  rank: number;
}

interface GameRanked {
  id: string;
  Name: string;
  Host: string;
  Opponent: string;
  Viewers_List: PlayerLeaderBoard[];
  Score_Host: number;
  Score_Opponent: number;
  CreatedAt: date;
  Mode: string;
}
