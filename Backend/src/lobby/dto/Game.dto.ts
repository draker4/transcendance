import {
  IsNumber,
  IsString,
  IsBoolean,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class GameDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom' | 'Training';

  @IsString()
  @IsNotEmpty()
  mode: 'League' | 'Party' | 'Training';

  @IsNumber()
  @IsNotEmpty()
  host: number;

  @IsNumber()
  opponent: number;

  @IsString()
  hostSide: 'Left' | 'Right';

  @IsString()
  status: 'Waiting' | 'Playing' | 'Finished' | 'Deleted';

  @IsString()
  result:
    | 'Not Started'
    | 'On Going'
    | 'Draw'
    | 'Player1'
    | 'Player2'
    | 'Deleted';

  @IsNumber()
  actualRound: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @IsNumber()
  @IsNotEmpty()
  maxPoint: 3 | 4 | 5 | 6 | 7 | 8 | 9;

  @IsNumber()
  @IsNotEmpty()
  maxRound: 1 | 3 | 5 | 7 | 9;

  @IsNumber()
  @IsNotEmpty()
  difficulty: 1 | 2 | 3 | 4 | 5;

  @IsBoolean()
  @IsNotEmpty()
  push: boolean;

  @IsString()
  @IsNotEmpty()
  background: string;

  @IsString()
  @IsNotEmpty()
  ball: string;
}
