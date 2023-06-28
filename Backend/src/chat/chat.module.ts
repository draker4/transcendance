/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { WsJwtGuard } from "./guard/wsJwt.guard";
import { UsersService } from "src/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/utils/typeorm/User.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { CryptoService } from "src/utils/crypto/crypto";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Channel]),
	],
	providers: [
		ChatGateway,
		WsJwtGuard,
		UsersService,
		CryptoService,
	],
})
export class ChatModule {}
