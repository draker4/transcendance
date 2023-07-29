import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScoreService } from '../service/score.service';
import { UpdateScoreDTO } from '../dto/UpdateScore.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':gameId')
  async getScoreByGameId(@Param('gameId') gameId: string, @Req() req) {
    //return this.scoreService.getScoreByGameId(gameId, req.user.id);
  }

  @Put('update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateScore(@Req() req, @Body() updateScore: UpdateScoreDTO) {
    //return this.scoreService.updateScore(req.user.id, updateScore);
  }
}
