import { Controller, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';
import { AchievementService } from '../service/achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  // 00 - api/achievement/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/achievement/get/:userId
  @Get('getAll/:userId')
  async getAllByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.achievementService.getAllByUserId(userId);
  }

  // 02 - api/achievement/get/:userId
  @Get('getLastThree/:userId')
  async getLastThreeByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.achievementService.getLastThreeByUserId(userId);
  }

  @Get('get/:userId/:achievementId')

  // 03 - api/achievement/collected/:userId/:achievementId
  @Put('collected/:userId/:achievementId')
  async collectAchievement(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('achievementId') achievementId: string,
  ) {
    return this.achievementService.collectAchievement(userId, achievementId);
  }
}
