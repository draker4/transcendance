import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Action } from '@Shared/types/Game.types';

export class ActionDTO {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsNumber()
  @IsNotEmpty()
  action: Action;

  @IsString()
  @IsNotEmpty()
  playerSide: 'Left' | 'Right';
}
