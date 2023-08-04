/* eslint-disable prettier/prettier */
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsObject, IsString, Length } from 'class-validator';
import { User } from 'src/utils/typeorm/User.entity';

export class sendMsgDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsObject()
  sender: User;

  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsBoolean()
  isServerNotif: boolean;
}

/*

  [N][!] note :
  passer la date en tant que type @IsDate génère des problèmes.
  J'essaie une méthode qui consiste à convertir en string avec :
      const dateString = date.toISOString()
  
  Avant de faire passer au backend avec websocket.
  Coté front on récupère la dateString de cette façon :
      const date = new Date(dateString);

*/
