import { Module } from '@nestjs/common';
import { UserController, UsersController } from './users.controller';
import { UsersService, UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/User.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController, UserController],
	providers: [UsersService, UserService]
})
export class UsersModule {}
