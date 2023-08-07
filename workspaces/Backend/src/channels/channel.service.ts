/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { ChannelDto } from "./dto/Channel.dto";
import { Avatar } from "src/utils/typeorm/Avatar.entity";
import { Channel } from "src/utils/typeorm/Channel.entity";
import { User } from "src/utils/typeorm/User.entity";
import { UserChannelRelation } from "src/utils/typeorm/UserChannelRelation";
import { Message } from "@/utils/typeorm/Message.entity";
import { EditChannelRelationDto } from "./dto/EditChannelRelation.dto";

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
				relations: ['avatar'],
			});
		return await this.channelRepository.findOne({
			where: { name: name, type: Not("privateMsg") },
			relations: ['avatar'],
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
		return await this.channelRepository.findOne({
			where: { id : id },
			relations: ['avatar'],
		});
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


		// this.log("Fetching from getChannelUsersRelations() : "); //checking [!]

		const usersRelation : UserChannelRelation[] = await this.userChannelRelation.find({
			where: { channelId : id }, relations: ["user", "user.avatar"]
		});
		
		/* [!]
		console.log("USER RELATION[0].isBanned) = ", usersRelation[0].isBanned); //checking
		console.log("USER RELATION[1].isBanned) = ", usersRelation[1].isBanned); //checking
		console.log("USER RELATION[2].isBanned) = ", usersRelation[2].isBanned); //checking
		console.log("USER RELATION[3].isBanned) = ", usersRelation[3].isBanned); //checking
		console.log("USER RELATION[4].isBanned) = ", usersRelation[4].isBanned); //checking
		console.log("USER RELATION[5].isBanned) = ", usersRelation[5].isBanned); //checking
		*/

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

	public async updateChannelUserRelation(relation:UserChannelRelation ) {
		const rep:ReturnData = {
			success: false,
			message: ""
		}
		
		try {
			const { userId, channelId } = relation;
			
			await this.userChannelRelation
			.createQueryBuilder()
			.update(UserChannelRelation)
			.set({
				isChanOp: relation.isChanOp,
				joined: relation.joined,
				invited: relation.invited,
				isBanned: relation.isBanned,
			})
			.where("userId = :userId AND channelId = :channelId", { userId, channelId })
			.execute()
			
			rep.success = true;
			
		} catch(e) {
			rep.message = e.message;
			rep.error = e;
		}
		return rep;
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

	// [!] to be called within a try-catch block
	public async editRelation(chanOpId: number, channelInfos:EditChannelRelationDto) {
		const rep:ReturnData = {
			success: false,
			message: ""
		}

		if (channelInfos.newRelation.joined === undefined 
			&& channelInfos.newRelation.invited === undefined 
			&& channelInfos.newRelation.isChanOp === undefined 
			&& channelInfos.newRelation.isBanned === undefined)
		throw new Error("need at least one property to edit channel relation");

		const	relation:UserChannelRelation = await this.userChannelRelation.findOne({
			where: { userId:channelInfos.userId, channelId:channelInfos.channelId }
		});

		if (!relation)
			throw new Error("can't find the user or the channel requested");


		// [+] to extract
		if (channelInfos.newRelation.joined !== undefined) {
			relation.joined = channelInfos.newRelation.joined;
			rep.message += `\nchanOp[${chanOpId}]:put joined to ${channelInfos.newRelation.joined} of user[${channelInfos.userId}]`
		}

		if (channelInfos.newRelation.isChanOp !== undefined) {
			relation.isChanOp = channelInfos.newRelation.isChanOp;
			rep.message += `\nchanOp[${chanOpId}]:put isChanOp to ${channelInfos.newRelation.isChanOp} of user[${channelInfos.userId}]`
		}

		if (channelInfos.newRelation.invited !== undefined) {
			relation.invited = channelInfos.newRelation.invited;
			rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.invited} of user[${channelInfos.userId}]`
		}

		if (channelInfos.newRelation.isBanned !== undefined) {
			relation.isBanned = channelInfos.newRelation.isBanned;
			rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.isBanned} of user[${channelInfos.userId}]`
		}

		// [+] save relation dans la db maintenant
		const repDatabase:ReturnData = await this.updateChannelUserRelation(relation);
		if (!repDatabase.success)
			throw new Error("Error occured while updating user channel relation in database : " + repDatabase.message);

		rep.success = true;
		return rep;
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

	async saveLastMessage(channelId: number, message: Message) {
		await this.channelRepository
			.createQueryBuilder()
			.relation(Channel, 'lastMessage')
			.of(channelId)
			.set(message);
	}
}
