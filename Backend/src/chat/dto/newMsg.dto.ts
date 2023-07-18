/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class newMsgDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;
}