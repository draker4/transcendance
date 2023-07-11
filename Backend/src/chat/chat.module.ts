/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { WsJwtGuard } from "./guard/wsJwt.guard";
import { UsersService } from "src/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/utils/typeorm/User.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { CryptoService } from "src/utils/crypto/crypto";
import { ChatService } from "./chat.service";
import { ChannelService } from "src/channels/channel.service";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { UserPongieRelation } from "src/utils/typeorm/UserPongieRelation";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Channel, Avatar, UserPongieRelation, UserChannelRelation]),
	],
	providers: [
		ChatGateway,
		WsJwtGuard,
		UsersService,
		CryptoService,
		ChatService,
		ChannelService,
	],
})
export class ChatModule {}
