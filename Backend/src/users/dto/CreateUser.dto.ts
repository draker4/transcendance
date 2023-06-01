import { IsNotEmpty, IsString } from "class-validator";

export class createUserDto {

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  phone: string;

  @IsString()
  image: string;
}
