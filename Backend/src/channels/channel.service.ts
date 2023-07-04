/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { CreatePrivateMsgChannelDto } from "./dto/CreatePrivateMsgChannel.dto";

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
			decrypt: false,
		  });
		const chan: ChannelDto = {
		  name: channel,
		  avatar: avatar,
		}
		this.channelRepository.save(chan);
	}


	// verification si la channel n'existe pas deja (dans les tables)
    // creation de la channel c'est bien le cas
	async joinOrCreatePrivateMsgChannel(userID:string, pongieId:string):Promise<CreatePrivateMsgChannelDto> {

		if(!userID || !pongieId || userID.length === 0 || pongieId.length === 0)
			throw new Error("a given id is null or an empty string");

		const name = this.formatPrivateMsgChannelName(userID, pongieId)
		console.log("formated name :[", name, ']'); // checking
		
		// verif si la channel existe, on la cree sinon :
		let channel = await this.getChannelbyName(name);
		if (!channel) {
			this.createPrivateMsgChannel(name);
			// check que la creation a eu lieu correctement
			channel = await this.getChannelbyName(name);
			if (!channel)
				throw new Error("can't create the channel " + name);
		}


		return channel;
	  }




	/* ------------------- tools -------------------------- */

	// name of Private Message channel format 
	// 'id1 id2' with id1 < id2
	private formatPrivateMsgChannelName(id1: string, id2:string): string {
		const lower:string = id1 < id2 ? id1 : id2;
		const higher:string = id1 > id2 ? id1 : id2;

		return lower + ' ' + higher;
	}

	private async getChannelbyName(name:string):Promise<Channel> {
		return await this.channelRepository.findOne({ where: { name : name } });
	}

	private async createPrivateMsgChannel(name: string) {
		const channel :CreatePrivateMsgChannelDto = {
			name: name,
			type: "privateMsg",
		}
		await this.channelRepository.save(channel);


	}
}
