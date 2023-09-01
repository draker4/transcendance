import {
  Controller,
  Put,
  Get,
  Req,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';

import { MatchmakingService } from '../service/matchmaking.service';
import StartMatchmakingDTO from '../dto/StartMatchmaking.dto';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  // 00 - api/matchmaking/status
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/matchmaking/start
  @Put('start')
  @UsePipes(new ValidationPipe({ transform: true }))
  startSearch(@Req() req, @Body() search: StartMatchmakingDTO) {
    return this.matchmakingService.startSearch(req.user.id, search);
  }

  // 02 - api/matchmaking/stop
  @Put('stop')
  stopSearch(@Req() req) {
    return this.matchmakingService.stopSearch(req.user.id);
  }

  // 03 - api/matchmaking/check
  @Get('check')
  checkSearch(@Req() req) {
    return this.matchmakingService.checkSearch(req.user.id);
  }
}
