import { Module } from '@nestjs/common';
import { StatsController } from './controller/stats.controller';
import { StatsService } from './service/stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'src/utils/typeorm/Stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stats])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
