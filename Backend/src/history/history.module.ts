import { Module } from '@nestjs/common';
import { HistoryController } from './controller/history/history.controller';
import { HistoryService } from './service/history/history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { History } from 'src/utils/typeorm/History.entity';
import { UserHistory } from 'src/utils/typeorm/UserHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([History]),
    TypeOrmModule.forFeature([UserHistory]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
