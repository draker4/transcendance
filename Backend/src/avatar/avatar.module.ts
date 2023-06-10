import { Module } from '@nestjs/common';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';

@Module({
  imports: [
		TypeOrmModule.forFeature([Avatar]),
	],
  controllers: [AvatarController],
  providers: [AvatarService]
})
export class AvatarModule {}