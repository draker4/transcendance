/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelService } from "src/channels/channel.service";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { Message } from "src/utils/typeorm/Message.entity";
import { MessagesService } from "./messages.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, Channel, Avatar]),
	],
	providers: [
		MessagesService,
		ChannelService,
	],
})
export class MessageModule {}