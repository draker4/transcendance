/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsObject, IsString, Length } from 'class-validator';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { User } from 'src/utils/typeorm/User.entity';

export class saveNewMsgDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsObject()
  channel: Channel;

  @IsNotEmpty()
  @IsObject()
  user:User;


  // [+] gestion one to one (ou many to one ?) avec user a implementer ensuite
}