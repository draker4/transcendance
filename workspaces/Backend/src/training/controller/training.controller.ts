import { Controller } from '@nestjs/common';
import { TrainingService } from 'src/training/service/training.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { Get } from '@nestjs/common';

@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  // 00 - api/training/status Pour test d'api
  @Public()
  @Get('status')
  Status() {
    return 'Working !';
  }
}
