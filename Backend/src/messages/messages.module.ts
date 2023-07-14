/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelService } from "src/channels/channel.service";
import { UsersService } from "src/users/users.service";
import { CryptoService } from "src/utils/crypto/crypto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { Message } from "src/utils/typeorm/Message.entity";
import { User } from "src/utils/typeorm/User.entity";
import { MessagesService } from "./messages.service";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";

@Module({
	imports: [
		TypeOrmModule.forFeature([Message, Channel, Avatar, User, UserChannelRelation]),
	],
	providers: [
		MessagesService,
		ChannelService,
		UsersService,
		CryptoService,
	],
})
export class MessageModule {}