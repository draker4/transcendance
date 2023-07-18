import { Socket } from 'socket.io';
import { Party } from 'src/game/party/Party';

export type AuthenticatedSocket = Socket & {
  data: {
    party: null | Party;
  };
};

export type ScoreData = {
  id: number;
  hostRound1: number;
  opponentRound1: number;
  hostRound2: number;
  opponentRound2: number;
  hostRound3: number;
  opponentRound3: number;
  hostRound4: number;
  opponentRound4: number;
  hostRound5: number;
  opponentRound5: number;
  hostRound6: number;
  opponentRound6: number;
  hostRound7: number;
  opponentRound7: number;
  hostRound8: number;
  opponentRound8: number;
  hostRound9: number;
  opponentRound9: number;
};

export type GameData = {
  uuid: string;
  name: string;
  host: number;
  opponent: number;
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';
  result: 'Player1' | 'Player2' | 'Draw' | 'On Going' | 'Not Started';
  actualRound: number;
  maxPoint: number;
  maxRound: number;
  hostSide: 'Left' | 'Right';
  difficulty: number;
  push: boolean;
  background: string;
  ball: string;
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
};

export type GameInfo = {
  uuid: string;
  name: string;
  hostName: string;
  opponentName: string;
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';
  result: 'Player1' | 'Player2' | 'Draw' | 'On Going' | 'Not Started';
  actualRound: number;
  maxPoint: number;
  maxRound: number;
  hostSide: 'Left' | 'Right';
  difficulty: number;
  push: boolean;
  background: string;
  ball: string;
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
};