import { IsNotEmpty, IsNumber } from 'class-validator';

export class channelIdDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
