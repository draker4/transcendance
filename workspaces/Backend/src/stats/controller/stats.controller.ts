import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from '../service/stats.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // 00 - api/stats/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/stats/get/:userId
  @Get('get/:userId')
  GetStatsByUserId(@Param('userId') userId: number) {
    return this.statsService.getStatsByUserId(userId);
  }
}
