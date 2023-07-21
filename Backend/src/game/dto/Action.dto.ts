import { IsNumber, IsString } from 'class-validator';
import { Action } from '@Shared/types/Game.types';

export class ActionDTO {
  @IsString()
  gameId: string;

  @IsNumber()
  action: Action;
}
