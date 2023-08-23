import { IsEnum, IsHexColor, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { string } from 'joi';
import { PongColors } from 'src/utils/enums/PongColors.enum';

export class UpdateUserAvatarDto {
  @IsNotEmpty()
  @IsHexColor()
  @IsEnum(PongColors)
  borderColor: string;

  @IsNotEmpty()
  @IsHexColor()
  @IsEnum(PongColors)
  backgroundColor: string;

  @IsNotEmpty()
  @IsNumber()
  isChannel: number;
}
