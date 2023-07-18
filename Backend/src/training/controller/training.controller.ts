import { Controller } from '@nestjs/common';
import { TrainingService } from 'src/training/service/training.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { Get, Put, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { TrainingDto } from 'src/training/dto/training.dto';
import { UpdateTrainingLevelDto } from 'src/training/dto/updateTrainingLevel.dto';
import { ValidationPipe, UsePipes } from '@nestjs/common';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  // 00 - api/training/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }

  // 01 - api/training - Get all training
  @Get()
  GetTraining() {
    return this.trainingService.getTraining();
  }

  // 02 - api/training/user/:id - Get userTraining level by userId
  @Get('level/:userId')
  GetUserTraining(@Param('userId', ParseIntPipe) userId: number) {
    return this.trainingService.getUserTrainingLevel(userId);
  }

  // 03 - api/training/user/:id - Update PlayerTraining level by userId
  @Put('level/:userId')
  @UsePipes(ValidationPipe)
  UpdateUserTraining(
    @Param('userTrainingId', ParseIntPipe) userId: number,
    @Body() updateTrainingLevelDto: UpdateTrainingLevelDto,
  ) {
    return this.trainingService.UpdateUserTrainingLevel(
      userId,
      updateTrainingLevelDto,
    );
  }

  // 11 - api/training/init - Init training
  @Post('init')
  @UsePipes(ValidationPipe)
  InitTraining(@Body() trainingDto: TrainingDto[]) {
    return this.trainingService.initTraining(trainingDto);
  }
}
