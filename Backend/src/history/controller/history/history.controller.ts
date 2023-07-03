import { Controller } from '@nestjs/common';
import { HistoryService } from 'src/history/service/history/history.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { Get, Put, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { HistoryDto } from 'src/history/dto/history.dto';
import { UserHistoryDto } from 'src/history/dto/userHistory.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // 00 - api/history/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/history/ - Get all history
  @Get()
  GetAllHistory() {
    return this.historyService.GetAllHistory();
  }

  // 02 - api/history/:id - Get history details by history_id
  @Get(':historyId')
  GetHistoryDetailsById(@Param('historyId', ParseIntPipe) historyId: number) {
    return this.historyService.GetHistoryDetailsById(historyId);
  }

  // 03 - api/history/settings/:id - Get history game settings by history_id
  @Get('settings/:historyId')
  GetHistorySettingsById(@Param('historyId', ParseIntPipe) historyId: number) {
    return this.historyService.GetHistorySettingsById(historyId);
  }

  // 04 - api/history/init - Post Initial History
  @Post('init')
  PostInitialHistory(@Body() historyDto: HistoryDto) {
    return this.historyService.PostInitialHistory(historyDto);
  }

  // 11 - api/history/user/:id - Get all PlayerHistory by userId
  @Get('user/:userId')
  GetUserHistoryStatus(@Param('userId', ParseIntPipe) userId: number) {
    return this.historyService.GetUserHistoryStatus(userId);
  }

  // 12 - api/history/user/:id - Update PlayerHistory by userHistoryId
  @Put('user/:userHistoryId')
  UpdateUserHistoryStatus(
    @Param('userHistoryId', ParseIntPipe) userHistoryId: number,
  ) {
    return this.historyService.UpdateUserHistoryStatus(userHistoryId);
  }

  // 13 - api/history/user/init - Post Initial PlayerHistory
  @Post('user/init')
  PostInitialUserHistoryStatus(@Body() userHistoryDto: UserHistoryDto) {
    return this.historyService.PostInitialUserHistoryStatus(userHistoryDto);
  }
}
