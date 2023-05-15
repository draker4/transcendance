import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class createUserDto {

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(10)
	password: string;
}
