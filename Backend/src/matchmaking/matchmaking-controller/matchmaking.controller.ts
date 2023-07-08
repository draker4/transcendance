import {
  Controller,
  Post,
  Get,
  Request,
} from '@nestjs/common';

import { MatchmakingService } from '../matchmaking-service/matchmaking.service';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly MatchmakingService: MatchmakingService) {}

  // 01 - api/matchmaking/start
  @Post('start')
  MatchmakeStart(@Request() req) {
    return this.MatchmakingService.MatchmakeStart(req);
  }

  // 02 - api/matchmaking/stop
  @Post('stop')
  MatchmakeStop(@Request() req) {
    return this.MatchmakingService.MatchmakeStop(req);
  }

  // 03 - api/matchmaking/update
  @Get('update')
  MatchmakeUpdate(@Request() req) {
    return this.MatchmakingService.MatchmakeUpdate(req);
  }

}
