import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateAchievementDataDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  xp: number;
}
