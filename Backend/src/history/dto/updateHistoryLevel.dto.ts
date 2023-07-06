import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateHistoryLevelDto {
  @IsNotEmpty()
  @IsNumber()
  levelValidated: number;
}
