import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class editChannelPasswordDto {
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  password: string;
}
