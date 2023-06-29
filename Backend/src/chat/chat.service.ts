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
	const	user = await this.usersService.getUserById(parseInt(id));

	if (!user)
		throw new WsException('no user');
	
	return user.channels;
  }
}
