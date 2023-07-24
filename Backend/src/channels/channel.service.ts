/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { User } from "src/utils/typeorm/User.entity";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";

type ChannelAndUsers = {
	channel: Channel;
	usersRelation: UserChannelRelation[];
}

@Injectable()
export class ChannelService {
	
	constructor(
		@InjectRepository(Channel)
		private readonly channelRepository: Repository<Channel>,
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>,
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

	public async getChannelAvatar(id: number):Promise<Channel> {
		return await this.channelRepository.findOne({ where: { id : id }, relations:["avatar"] });
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

	public async getChannelUsersRelations(id: number):Promise<ChannelAndUsers> {
		const channel: Channel = await this.channelRepository.findOne({
			where: { id : id }, relations: ["users", "users.avatar"]
		});


		// console.log("channel = ", channel); //checking

		const usersRelation : UserChannelRelation[] = await this.userChannelRelation.find({
			where: { channelId : id }, relations: ["user", "user.avatar"]
		});
		
		
		// console.log("USER RELATION[0].user = ", usersRelation[0].user); //checking

		return {
			channel: channel,
			usersRelation: usersRelation,
		}
	}


	public async checkChanOpPrivilege(userId:number, channelId:number):Promise<{isChanOp:boolean, error?:string}> {
		const relation:UserChannelRelation = await this.getOneUserChannelRelation(userId, channelId);
		try {
			this.verifyPermissions(userId, channelId, relation);
			return {
				isChanOp:relation.isChanOp,
			}
		} catch (error) {
			return {
				isChanOp:false,
				error:error.message,
			}
		}
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
			where: { userId:userId, channelId:channelId, joined:true, isBanned:false }
		});
		
		return relation ? true : false;
	}
	


	// ------------------- PRIVATE ---------------------------------- //

	private async getOneUserChannelRelation(userId:number, channelId:number):Promise<UserChannelRelation> {
		return (await this.getChannelUsersRelations(channelId)).usersRelation.find( (relation) => relation.userId === userId);
	}
	
	// [+] a affinner avec l'evolution des types de channel, banlist guestlist etc.
	private verifyPermissions(userId:number, channelId:number, relation: UserChannelRelation) {
		if (!relation)
		 throw new Error(`channel(id: ${channelId}) has no relation with user(id: ${userId})`);
		else if (relation.isBanned)
			throw new Error(`channel(id: ${channelId}) user(id: ${userId}) is banned`);
		else if (!relation.isChanOp)
			throw new Error(`channel(id: ${channelId}) user(id: ${userId}) channel operator privileges required`);
	}
	
	
	
	
	
	// tools
	
	// [!][?] virer ce log pour version build ?
	private log(message?: any) {
		const cyan = '\x1b[36m';
		const stop = '\x1b[0m';
		
		process.stdout.write(cyan + '[channel service]  ' + stop);
		console.log(message);
	}
}
