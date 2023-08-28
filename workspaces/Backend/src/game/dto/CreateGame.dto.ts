import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateGameDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: 'Classic' | 'Best3' | 'Best5' | 'Custom';

  @IsString()
  @IsNotEmpty()
  mode: 'League' | 'Party';

  @IsNumber()
  @IsNotEmpty()
  host: number;

  @IsNumber()
  @IsOptional()
  opponent: number;

  @IsNumber()
  @IsOptional()
  invite: number;

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
  difficulty: -2 | -1 | 0 | 1 | 2;

  @IsBoolean()
  @IsNotEmpty()
  push: boolean;

  @IsBoolean()
  @IsNotEmpty()
  pause: boolean;

  @IsString()
  @IsNotEmpty()
  background: string;

  @IsString()
  @IsNotEmpty()
  ball: string;
}
