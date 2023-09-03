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
  @Get('get/:userId')
  async getAchievementByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.achievementService.getUserAchievement(userId);
  }

  // 02 - api/achievement/annonced/:userId/:achievementId
  @Put('updateAnnonce/:userId/:annonceId/:achievementId')
  async achievementAnnonced(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('achievementId') achievementId: string,
  ) {
    return this.achievementService.achievementAnnonced(userId, achievementId);
  }
}
