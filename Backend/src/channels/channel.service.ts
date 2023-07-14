/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { User } from "src/utils/typeorm/User.entity";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";

@Injectable()
export class ChannelService {
	
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>,

		// [!] ajouté pour mon guard Channel
		@InjectRepository(UserChannelRelation)
    	private readonly userChannelRelation: Repository<UserChannelRelation>
	
	) {}

	async getChannelByName(
		name: string,
		privateMsg: boolean,
	) {
		if (privateMsg)
			return await this.channelRepository.findOne({
				where: { name: name, type: "privateMsg" },
			});
		return await this.channelRepository.findOne({
			where: { name: name, type: Not("privateMsg") },
		});
	}

	async addChannel(
		channelName: string,
		type: 'public' | 'protected' | 'private' | 'privateMsg',
	) {

		const	channel = await this.getChannelByName(channelName, false);

		if (channel)
			return null;
		
		const	avatar = await this.avatarRepository.save({
			name: channelName,
			image: '',
			text: '',
			variant: 'rounded',
			borderColor: '#22d3ee',
			backgroundColor: '#22d3ee',
			empty: true,
			isChannel: true,
			decrypt: false,
		  });
		
		const newChannel: ChannelDto = {
		  name: channelName,
		  avatar: avatar,
		  type: type,
		}
		return await this.channelRepository.save(newChannel);
	}


	// name of Private Message channel format 
	// 'id1 id2' with id1 < id2
	public formatPrivateMsgChannelName(id1: string, id2:string): string {
		const lower:string = id1 < id2 ? id1 : id2;
		const higher:string = id1 > id2 ? id1 : id2;

		return lower + ' ' + higher;
	}

	public async getChannelbyName(name:string):Promise<Channel> {
		return await this.channelRepository.findOne({ where: { name : name } });
	}

	public async getChannelById(id: number):Promise<Channel> {
		return await this.channelRepository.findOne({ where: { id : id }});
	}

	public async getChannelMessages(id: number):Promise<Channel> {
		return await this.channelRepository.findOne({ where: { id : id }, relations:["messages", "messages.user", "messages.user.avatar"] });
	}

	public async getChannelUsers(id: number):Promise<Channel> {
		return await this.channelRepository.findOne({
			where: { id : id },
			relations: ["users", "users.avatar"],
		});
	}

	public async updateChannelUsers(channel: Channel, user: User) {
		await this.channelRepository
		  .createQueryBuilder()
		  .relation(Channel, "users")
		  .of(channel.id)
		  .add(user);
	  }

	public async getPrivatePongie(channelId: number, userId: number) {
		const	channel = await this.getChannelUsers(channelId);

		if (!channel)
			return null;
		
		return channel.users.find(user => user.id !== userId);
	}

	public async isUserInChannel(userId: number, channelId: number):Promise<boolean> {
		const	relation = await this.userChannelRelation.findOne({
			where: { userId:userId, channelId:channelId, joined:true, isbanned:false }
		});

		return relation ? true : false;
	}
}
