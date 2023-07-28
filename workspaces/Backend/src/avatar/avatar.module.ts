/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/utils/typeorm/User.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Token } from 'src/utils/typeorm/Token.entity';
import { ChannelService } from 'src/channels/channel.service';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { BackupCode } from '@/utils/typeorm/BackupCode.entity';

@Module({
  imports: [
		TypeOrmModule.forFeature([Avatar, User, Channel, Token, UserChannelRelation, BackupCode]),
	],
  controllers: [AvatarController],
  providers: [
    AvatarService,
    UsersService,
    CryptoService,
	ChannelService,
	
  ],
})
export class AvatarModule {}
