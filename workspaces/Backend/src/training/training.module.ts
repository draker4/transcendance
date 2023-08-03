import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingController } from './controller/training.controller';

import { TrainingService } from './service/training.service';
import { ScoreService } from '@/score/service/score.service';
import { CryptoService } from '@/utils/crypto/crypto';
import { UsersService } from '@/users/users.service';
import { AvatarService } from '@/avatar/avatar.service';
import { StatsService } from '@/stats/service/stats.service';
import { ChannelService } from '@/channels/channel.service';

import { Training } from 'src/utils/typeorm/Training.entity';
import { Score } from '@/utils/typeorm/Score.entity';
import { User } from '@/utils/typeorm/User.entity';
import { Avatar } from '@/utils/typeorm/Avatar.entity';
import { Channel } from '@/utils/typeorm/Channel.entity';
import { Token } from '@/utils/typeorm/Token.entity';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { Stats } from '@/utils/typeorm/Stats.entity';
import { UserChannelRelation } from '@/utils/typeorm/UserChannelRelation';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Training,
      Score,
      User,
      Avatar,
      Channel,
      Token,
      BackupCode,
      SocketToken,
      Stats,
      UserChannelRelation,
    ]),
  ],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    ScoreService,
    CryptoService,
    UsersService,
    AvatarService,
    StatsService,
    ChannelService,
  ],
  exports: [TrainingService],
})
export class TrainingModule {}
