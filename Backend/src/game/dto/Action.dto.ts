import { IsNumber, IsString } from 'class-validator';
import { Action } from '@Shared/Game/Game.type';

export class ActionDTO {
  @IsString()
  gameId: string;

  @IsNumber()
  action: Action;
}
