/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "diagnostics_channel";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
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

	async createPrivateMsgChannel(userID:string, pongieId:string) {

		const name = this.formatPrivateMsgChannelName(userID, pongieId)
		// verif si la channel existe deja :
		console.log("formated name :[", name, ']');
		
	  }




	/* ------------------- tools -------------------------- */

	// name of Private Message channel format 
	// 'id1 id2' with id1 < id2
	private formatPrivateMsgChannelName(id1: string, id2:string): string {
		const lower:string = id1 < id2 ? id1 : id2;
		const higher:string = id1 > id2 ? id1 : id2;

		return lower + ' ' + higher;
	}
}
