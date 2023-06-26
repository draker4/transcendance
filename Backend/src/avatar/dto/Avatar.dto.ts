import {
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AvatarDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  image: string;

  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  variant: string;

  @IsNotEmpty()
  //   @IsString()
  @IsHexColor()
  borderColor: string;

  @IsNotEmpty()
  //   @IsString()
  @IsHexColor()
  backgroundColor: string;

  @IsNotEmpty()
  @IsBoolean()
  empty: boolean;
}
