type GameSettings = {
  name: string;
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
  maxRound: 1 | 3 | 5 | 7 | 9;
  difficulty: 1 | 2 | 3 | 4 | 5;
  push: boolean;
  hostSide: "Left" | "Right";
  background: string;
  ball: string;
  type: string;
};
