// export type ScoreDB = {
//   id: number;
//   createdAt: Date;
//   updatedAt: Date;
//   hostRoundWon: 0 | 1 | 2 | 3 | 4;
//   opponentRoundWon: 0 | 1 | 2 | 3 | 4;
//   hostRound1: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound1: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound2: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound2: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound3: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound3: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound4: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound4: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound5: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound5: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound6: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound6: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound7: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound7: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound8: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound8: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   hostRound9: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   opponentRound9: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// };

// export type GameDB = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   name: string;
//   type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
//   mode: 'League' | 'Party' | 'Training';
//   host: number;
//   opponent: number;
//   hostSide: 'Left' | 'Right';
//   score: ScoreDB;
//   status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';
//   result:
//     | 'Not Started'
//     | 'On Going'
//     | 'Draw'
//     | 'Player1'
//     | 'Player2'
//     | 'Deleted';
//   actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;
//   maxRound: 1 | 3 | 5 | 7 | 9;
//   difficulty: 1 | 2 | 3 | 4 | 5;
//   push: boolean;
//   background: string;
//   ball: string;
// };
