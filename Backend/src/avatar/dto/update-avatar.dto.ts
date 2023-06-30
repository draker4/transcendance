import { IsBoolean, IsHexColor, IsNotEmpty } from 'class-validator';

export class UpdateAvatarDto {
  @IsNotEmpty()
  @IsHexColor()
  borderColor: string;

  @IsNotEmpty()
  @IsHexColor()
  backgroundColor: string;

  @IsNotEmpty()
  @IsBoolean()
  isChannel: boolean;
}
