/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { Avatar } from "src/utils/typeorm/Avatar.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([Channel, Avatar]),
	],
	controllers: [ChannelController],
	providers: [ChannelService],
})
export class ChannelModule {}
