/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';

export class userLightDto {
	
	@IsNotEmpty()
	@IsNumber()
	id:number;
	
	@IsNotEmpty()
	@IsString()
	login:string;

	@IsNotEmpty()
	@IsObject()
	avatar: Avatar;

}