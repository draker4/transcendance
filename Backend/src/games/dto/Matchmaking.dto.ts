import { IsNotEmpty, IsNumber } from "class-validator";

export class MatchmakingDTO {

  @IsNotEmpty()
  @IsNumber()
  Player: number;

  @IsNotEmpty()
  CreatedAt: Date;

}

