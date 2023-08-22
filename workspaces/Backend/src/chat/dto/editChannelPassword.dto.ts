import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class editChannelPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @IsString()
  @IsNotEmpty()
  @Length(0, 20)
  password: string;
}
