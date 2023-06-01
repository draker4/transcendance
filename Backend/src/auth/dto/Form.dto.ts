import { IsNotEmpty, IsString } from "class-validator";

export class FormDto {

	@IsNotEmpty()
	@IsString()
	email: string;

	@IsNotEmpty()
	@IsString()
	login: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}
