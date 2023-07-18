import { Controller, Post, Get, Request, Param } from '@nestjs/common';
import { LobbyService } from '../lobby-service/lobby.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('lobby/')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  // 00 - api/lobby/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/lobby/create
  @Post('create')
  CreateGame(@Request() req) {
    return this.lobbyService.CreateGame(req);
  }

  // 02 - api/lobby/join
  @Post('join')
  JoinGame(@Request() req) {
    return this.lobbyService.JoinGame(req);
  }

  // 03 - api/lobby/getall
  @Get('getall')
  GetAllGames() {
    return this.lobbyService.GetAll();
  }

  // 04 - api/lobby/get/:id
  @Get('get/:id')
  GetGame(@Param('id') id: string, @Request() req) {
    return this.lobbyService.GetGameById(id, req.user.id);
  }

  // 04 - api/lobby/quit
  @Post('quit')
  Quit(@Request() req) {
    return this.lobbyService.Quit(req);
  }

  // 05 - api/lobby/isingame
  @Get('isingame')
  IsInGame(@Request() req) {
    return this.lobbyService.IsInGame(req);
  }

  // 06 - api/lobby/GetLeague
  @Get('getleague')
  GetLeague(@Request() req) {
    // return this.lobbyService.GetLeague(req);
  }
}
