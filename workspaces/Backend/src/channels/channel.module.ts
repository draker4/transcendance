/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";
import { UsersService } from "@/users/users.service";
import { CryptoService } from "@/utils/crypto/crypto";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, Avatar, UserChannelRelation]),
	],
	controllers: [ChannelController],
	providers: [
		ChannelService,
	],
})
export class ChannelModule {}
