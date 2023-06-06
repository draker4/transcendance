import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/utils/typeorm/User.entity';
import { CryptoService } from 'src/utils/crypto/crypto';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [
		UsersService,
		CryptoService,
	],
	exports: [UsersService]
})
export class UsersModule {}
