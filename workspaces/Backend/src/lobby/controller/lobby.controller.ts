import {
  Controller,
  Post,
  Get,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { LobbyService } from '../service/lobby.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { CreateGameDTO } from '@/game/dto/CreateGame.dto';

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
  @UsePipes(new ValidationPipe({ transform: true })) // Use ValidationPipe with transform option
  CreateGame(@Req() req, @Body() game: CreateGameDTO) {
    return this.lobbyService.CreateGame(req.user.id, game);
  }

  // 02 - api/lobby/join
  @Put('join/:gameId')
  JoinGame(@Req() req, @Param('gameId') gameId: string) {
    return this.lobbyService.JoinGame(req.user.id, gameId);
  }

  // 03 - api/lobby/getall
  @Get('getall/:mode?')
  GetAllGames(@Param('mode') mode?: 'League' | 'Party') {
    console.log('mode:', mode);
    return this.lobbyService.GetAll(mode);
  }

  // 04 - api/lobby/quit
  @Post('quit')
  Quit(@Req() req) {
    return this.lobbyService.Quit(req.user.id);
  }

  // 05 - api/lobby/isingame
  @Get('isingame')
  IsInGame(@Req() req) {
    return this.lobbyService.IsInGame(req.user.id);
  }

  // 06 - api/lobby/GetLeague
  @Get('getleague')
  GetLeague() {
    // return this.lobbyService.GetLeague(req);
  }
}
