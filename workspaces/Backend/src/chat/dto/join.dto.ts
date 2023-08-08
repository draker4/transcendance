/* eslint-disable prettier/prettier */
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class JoinDto {

	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsNotEmpty()
	@IsString()
	channelName: string;
	
	@IsNotEmpty()
	@IsIn(["public", "private", "protected", "privateMsg"])
	channelType: "public" | "private" | "privateMsg" | "protected";
}
