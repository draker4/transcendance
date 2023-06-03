import { Controller, Post, Get, HttpStatus, Query, Request } from '@nestjs/common';
import { GamesService } from '../games-service/games-service.service';

// import { Response } from 'express';
// import { Public } from 'src/decorators/public.decorator';

@Controller('games')
export class GamesController {

    constructor(private readonly GamesService: GamesService) {}

    // 01 - api/games/create
    @Post("create")
    CreateGame(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 02 - api/games/join
    @Post("join")
    JoinGame(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 03 - api/games/getall
    @Get("getall")
    GetAll(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 04 - api/games/quit
    @Post("quit")
    Quit(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 05 - api/games/matchmake/start
    @Post("matchmake/start")
    MatchmakeStart(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 06 - api/games/matchmake/stop
    @Post("matchmake/stop")
    MatchmakeStop(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }

    // 07 - api/games/matchmake/update
    @Get("matchmake/update")
    MatchmakeUpdate(@Request() req) {
      // return this.GamesService.CreateGame(req.user.id);
      return req.user.id;
    }
}