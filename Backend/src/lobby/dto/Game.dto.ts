import {
  IsNumber,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class GameDTO {
  @IsString()
  uuid: string;

  @IsString()
  Name: string;

  @IsNumber()
  Host: number;

  @IsNumber()
  Opponent: number;

  @IsArray()
  @IsNumber({}, { each: true })
  viewersList: number[];

  @IsNumber()
  Score_Host: number;

  @IsNumber()
  Score_Opponent: number;

  @IsString()
  Status: string;

  @IsString()
  CreatedAt: string;

  @IsNumber()
  Winner: number;

  @IsNumber()
  Loser: number;

  @IsBoolean()
  Push: boolean;

  @IsNumber()
  Score: number;

  @IsNumber()
  Difficulty: number;

  @IsNumber()
  Round: number;

  @IsString()
  Side: string;

  @IsString()
  Background: string;

  @IsString()
  Ball: string;

  @IsString()
  Type: string;

  @IsString()
  Mode: string;
}
