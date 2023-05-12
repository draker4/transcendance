import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";
import { Entity } from "typeorm";

export class createUserDto {

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	nickname: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(10)
	password: string;
}
