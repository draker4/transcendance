/* eslint-disable prettier/prettier */
import { IsBoolean, IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class AvatarDto {
  @IsString()
  image: string;

  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  variant: string;

  @IsNotEmpty()
  @IsHexColor()
  borderColor: string;

  @IsNotEmpty()
  @IsHexColor()
  backgroundColor: string;

  @IsNotEmpty()
  @IsBoolean()
  empty: boolean;

  @IsBoolean()
  @IsNotEmpty()
  decrypt: boolean;
}
