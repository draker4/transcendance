import { IsNumber, IsString, IsBoolean, IsUUID } from 'class-validator';

export class GameDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  name: string;

  @IsNumber()
  host: number;

  @IsNumber()
  opponent: number;

  @IsString()
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';

  @IsString()
  result: 'Player1' | 'Player2' | 'Draw' | 'On Going' | 'Not Started';

  @IsNumber()
  actualRound: number;

  @IsNumber()
  maxPoint: number;

  @IsNumber()
  maxRound: number;

  @IsString()
  hostSide: 'Left' | 'Right';

  @IsNumber()
  difficulty: number;

  @IsBoolean()
  push: boolean;

  @IsString()
  background: string;

  @IsString()
  ball: string;

  @IsString()
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';
}
