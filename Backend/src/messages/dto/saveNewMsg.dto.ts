/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsObject, IsString, Length } from 'class-validator';
import { Channel } from 'src/utils/typeorm/Channel.entity';

export class AddMsgDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsObject()
  channel: Channel;


  // [+] gestion one to one (ou many to one ?) avec user a implementer ensuite
}