/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "diagnostics_channel";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { AvatarDto } from "src/avatar/dto/Avatar.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";

@Injectable()
export class ChannelService {
	
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>,
	) {}

	async addChannel(channel: string) {
		const	avatar = await this.avatarRepository.save({
			name: channel,
			image: '',
			text: '',
			variant: 'rounded',
			borderColor: '#22d3ee',
			backgroundColor: '#22d3ee',
			empty: true,
			isChannel: true,
		  });
		const chan: ChannelDto = {
		  name: channel,
		  avatar: avatar,
		}
		this.channelRepository.save(chan);
	}
}
