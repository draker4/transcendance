import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Public()
  @Get(':game')
  test(@Param('game') gameName: string) {
    // this.gameService.addGame(gameName, 'public');
  }
}
