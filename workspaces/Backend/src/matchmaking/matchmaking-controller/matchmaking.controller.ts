import { Controller, Post, Get, Request } from '@nestjs/common';

import { MatchmakingService } from '../matchmaking-service/matchmaking.service';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  // 01 - api/matchmaking/start
  @Post('start')
  MatchmakeStart(@Request() req) {
    return this.matchmakingService.MatchmakeStart(req);
  }

  // 02 - api/matchmaking/stop
  @Post('stop')
  MatchmakeStop(@Request() req) {
    return this.matchmakingService.MatchmakeStop(req);
  }

  // 03 - api/matchmaking/update
  @Get('update')
  MatchmakeUpdate(@Request() req) {
    return this.matchmakingService.MatchmakeUpdate(req);
  }
}
