import { Module } from '@nestjs/common';
import { HistoryController } from './controller/history/history.controller';
import { HistoryService } from './service/history/history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { History } from 'src/utils/typeorm/History.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([History]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
