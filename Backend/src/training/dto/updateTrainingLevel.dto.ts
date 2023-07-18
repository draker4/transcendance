import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTrainingLevelDto {
  @IsNotEmpty()
  @IsNumber()
  levelValidated: number;
}
