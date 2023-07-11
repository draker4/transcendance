import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrivateMsgChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  //   @IsObject()
  //   @IsNotEmpty()
  //   avatar: Avatar;
  //   Pas d'avatar pour privMsgChannel on affiche celui de l'autre user

  @IsString()
  @IsNotEmpty()
  type: 'public' | 'protected' | 'private' | 'privateMsg';
}
