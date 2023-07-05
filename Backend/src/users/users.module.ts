/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { CryptoService } from 'src/utils/crypto/crypto';
import { Channel } from 'src/utils/typeorm/Channel.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Channel]),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		CryptoService,
	],
})
export class UsersModule {}
