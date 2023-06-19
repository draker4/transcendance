import { IsNotEmpty, IsNumber } from "class-validator";

export class MatchmakingDTO {

  @IsNotEmpty()
  @IsNumber()
  Waiter_Id: number;

  @IsNotEmpty()
  @IsNumber()
  Player_Id: number;

  @IsNotEmpty()
  CreatedAt: Date;

}

