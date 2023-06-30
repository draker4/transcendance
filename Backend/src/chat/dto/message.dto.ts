/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class Message {

	@IsNotEmpty()
	@IsString()
	text: string;
}
