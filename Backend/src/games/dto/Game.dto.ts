import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from "class-validator";
import { v4 as uuidv4 } from 'uuid';

export class GameDTO {

  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsOptional()
  @IsString()
  Password?: string;

  @IsNotEmpty()
  @IsNumber()
  Host: number;

  @IsNotEmpty()
  @IsNumber()
  Opponent: number;

  @IsArray()
  @IsNumber({}, { each: true })
  viewersList: number[];

  @IsNotEmpty()
  @IsNumber()
  Score_Host: number;

  @IsNotEmpty()
  @IsNumber()
  Score_Opponent: number;

  @IsNotEmpty()
  @IsString()
  Status: string;

  @IsNotEmpty()
  @IsString()
  CreatedAt: string;

  @IsNumber()
  Winner: number;

  @IsNumber()
  Loser: number;
}

