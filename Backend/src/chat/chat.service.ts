/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from "@nestjs/websockets";
import { UsersService } from "src/users/users.service";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { User } from "src/utils/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
	private readonly usersService: UsersService,
  ) {}

  async getChannels(id: string) {
	const	user = await this.usersService.getUserChannels(parseInt(id));

	if (!user)
		return {
      "success": "false",
      "channels": [],
    }
  
	return {
      "success": "true",
      "channels": user.channels,
    };
  }

  async getPongies(id: string) {
	const	user = await this.usersService.getUserPongies(parseInt(id));

	if (!user)
		return {
      "success": "false",
      "pongies": [],
    }
  
	return {
      "success": "true",
      "pongies": user.pongies,
    };
  }
}
