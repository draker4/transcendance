/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class newMsgDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsOptional()
  @IsBoolean()
  join?: boolean;

  @IsString()
  @IsOptional()
  source?: string;
}
