import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AvatarDto {
	
	@IsNumber()
	userId: number;

	@IsString()
	image: string;

	@IsNotEmpty()
	@IsString()
	variant: string;

	@IsNotEmpty()
	@IsString()
	borderColor: string;

	@IsString()
	text: string;

	@IsBoolean()
	@IsNotEmpty()
	empty: boolean;
}
