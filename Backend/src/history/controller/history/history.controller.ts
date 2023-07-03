import { Controller } from '@nestjs/common';
import { HistoryService } from 'src/history/service/history/history.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { Get, Put, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { HistoryDto } from 'src/history/dto/history.dto';
import { UserHistoryDto } from 'src/history/dto/UserHistory.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // 00 - api/history/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/history/user/:id - Get userHistory by userId
  @Get(':userId')
  GetUserHistory(@Param('userId', ParseIntPipe) userId: number) {
    //return this.historyService.getUserHistory(userId);
  }

  // 02 - api/history/user/:id - Update PlayerHistory by userHistoryId
  @Put(':userHistoryId')
  UpdateUserHistory(
    @Param('userHistoryId', ParseIntPipe) userHistoryId: number,
  ) {
    //return this.historyService.UpdateUserHistory(userHistoryId);
  }

  // 03 - api/history/user/init - Post Initial PlayerHistory
  @Post('user/init')
  PostInitialUserHistory(@Body() userHistoryDto: UserHistoryDto) {
    //return this.historyService.PostInitialUserHistory(userHistoryDto);
  }
}
