import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createUserDto {

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  first_name?: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  passwordHashed?: string;

  @IsNumber()
  @IsOptional()
  expirationCode?: number;

  @IsString()
  @IsOptional()
  verifyCode?: string;

  @IsBoolean()
  @IsNotEmpty()
  verified: boolean;
}
