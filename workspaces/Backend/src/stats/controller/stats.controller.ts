import {
  Controller,
  Get,
  Put,
  Param,
  UsePipes,
  ValidationPipe,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { StatsService } from '../service/stats.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { UpdateStatsDTO } from '../dto/UpdateStats.dto';

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
  @Get('getResume/:userId')
  async getResumeStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.statsService.getResumeStats(userId);
  }

  // 01 - api/stats/get/:userId
  @Get('getFull/:userId')
  async getFullStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.statsService.getFullStats(userId);
  }

  // 11 - api/stats/update/:userId
  @Put('update/:userId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async UpdateStats(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() update: UpdateStatsDTO,
  ) {
    return this.statsService.updateStats(userId, update);
  }
}
