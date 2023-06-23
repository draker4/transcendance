import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
	@IsString()
	borderColor: string;

	@IsNotEmpty()
	@IsString()
	backgroundColor: string;

	@IsNotEmpty()
	@IsBoolean()
	empty: boolean;
}
