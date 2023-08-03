import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateStatsDTO {
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
  @IsOptional()
  opponent: number;

  @IsString()
  @IsNotEmpty()
  hostSide: 'Left' | 'Right';

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
