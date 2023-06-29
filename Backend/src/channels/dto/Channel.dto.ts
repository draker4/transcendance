/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsObject, IsString } from "class-validator";
import { Avatar } from "src/utils/typeorm/Avatar.entity";

export class ChannelDto {

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsObject()
	@IsNotEmpty()
	avatar: Avatar;

}
