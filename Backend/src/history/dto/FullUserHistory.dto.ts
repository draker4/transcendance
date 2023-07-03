import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class FullUserHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  userHistoryId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  historyId: number;

  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

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
