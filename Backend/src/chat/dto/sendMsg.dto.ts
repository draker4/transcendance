/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class sendMsgDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 350)
  content: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;
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
