import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class UserHistoryDto {
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
}
