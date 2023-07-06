import { Controller } from '@nestjs/common';
import { HistoryService } from 'src/history/service/history/history.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { Get, Put, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { HistoryDto } from 'src/history/dto/history.dto';
import { UpdateHistoryLevelDto } from 'src/history/dto/updateHistoryLevel.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // 00 - api/history/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/history - Get all history
  @Get()
  GetHistory() {
    return this.historyService.getHistory();
  }

  // 02 - api/history/user/:id - Get userHistory level by userId
  @Get('level/:userId')
  GetUserHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.historyService.getUserHistoryLevel(userId);
  }

  // 03 - api/history/user/:id - Update PlayerHistory level by userId
  @Put('level/:userId')
  @UsePipes(ValidationPipe)
  UpdateUserHistory(
    @Param('userHistoryId', ParseIntPipe) userId: number,
    @Body() updateHistoryLevelDto: UpdateHistoryLevelDto,
  ) {
    return this.historyService.UpdateUserHistoryLevel(
      userId,
      updateHistoryLevelDto,
    );
  }

  // 11 - api/history/init - Init history
  @Post('init')
  @UsePipes(ValidationPipe)
  InitHistory(@Body() historyDto: HistoryDto[]) {
    return this.historyService.initHistory(historyDto);
  }
}
