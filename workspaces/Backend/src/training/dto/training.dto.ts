import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class TrainingDto {
  @IsNotEmpty()
  @IsNumber()
  trainingId: number;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  push: boolean;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsNotEmpty()
  @IsNumber()
  round: number;

  @IsNotEmpty()
  @IsNumber()
  difficulty: number;

  @IsOptional()
  @IsString()
  background: string;

  @IsOptional()
  @IsString()
  ball: string;
}
