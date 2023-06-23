import {
  Controller,
  Post,
  Get,
  HttpStatus,
  Query,
  Request,
} from '@nestjs/common';
import { GamesService } from '../games-service/games-service.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('games')
export class GamesController {
  constructor(private readonly GamesService: GamesService) {}

  // 00 - api/games/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/games/create
  @Post('create')
  CreateGame(@Request() req) {
    return this.GamesService.CreateGame(req);
  }

  // 02 - api/games/join
  @Post('join')
  JoinGame(@Request() req) {
    return this.GamesService.JoinGame(req);
  }

  // 03 - api/games/getall
  @Get('getall')
  GetAll(@Request() req) {
    return this.GamesService.GetAll(req);
  }

  // 04 - api/games/quit
  @Post('quit')
  Quit(@Request() req) {
    return this.GamesService.Quit(req);
  }

  // 05 - api/games/matchmake/start
  @Post('matchmake/start')
  MatchmakeStart(@Request() req) {
    return this.GamesService.MatchmakeStart(req);
  }

  // 06 - api/games/matchmake/stop
  @Post('matchmake/stop')
  MatchmakeStop(@Request() req) {
    return this.GamesService.MatchmakeStop(req);
  }

  // 07 - api/games/matchmake/update
  @Get('matchmake/update')
  MatchmakeUpdate(@Request() req) {
    return this.GamesService.MatchmakeUpdate(req);
  }

  // 08 - api/games/isingame
  @Get('isingame')
  IsInGame(@Request() req) {
    return this.GamesService.IsInGame(req);
  }

  // 09 - api/games/matchmake/update
  @Get('matchmake/playerwaiting')
  GetWaiters(@Request() req) {
    return this.GamesService.GetWaiters(req);
  }
}
