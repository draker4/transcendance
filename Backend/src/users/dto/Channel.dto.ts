/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class ChannelDto {

	@IsString()
	name: string;
}
