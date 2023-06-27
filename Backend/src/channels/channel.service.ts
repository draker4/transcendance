/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "diagnostics_channel";
import { ChannelDto } from "src/users/dto/Channel.dto";
import { Repository } from "typeorm";

@Injectable()
export class ChannelService {
	
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
	) {}

	async addChannel(channel: string) {
		const chan: ChannelDto = {
		  name: channel,
		}
		this.channelRepository.save(chan);
	}
}
