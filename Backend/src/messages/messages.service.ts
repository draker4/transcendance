/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ChannelService } from 'src/channels/channel.service';
import { sendMsgDto } from 'src/chat/dto/sendMsg.dto';
import { UsersService } from 'src/users/users.service';
import { Message } from 'src/utils/typeorm/Message.entity';
import { Repository } from 'typeorm';
import { saveNewMsgDto } from './dto/saveNewMsg.dto';

@Injectable()
export class MessagesService {

	constructor(
		@InjectRepository(Message)
		private readonly messageRepository : Repository<Message>,
		
		// ajouter aussi Channel Repo ?
		// @InjectRepository(Channel)
		// private readonly channelRepository: Repository<Channel>,
		private readonly channelService: ChannelService,
		private readonly userService: UsersService,
		
		// et apres userRepo ?
		
	) {}

	async addMessage(message:sendMsgDto) {
		console.log("pshhhhhhehhshhhzzzz surpression du cerveau");
		console.log("message : ", message);

		// 1 - creer le message et l'enregistrer dans sa table

		// besoin de l'objet channel concerne [?][+] avec sa relation message
		const channel = await this.channelService.getChannelById(message.channelId);

		// idem pour relation one to one user
		const user = await this.userService.getUserById(message.senderId);

		if (!channel || !user)
			throw new WsException("Database can't find " + message.channelName);

		// besoin du dto de nouveau msg
		const newMsg :saveNewMsgDto = {
			content: message.content,
			channel: channel,
			user: user,
		}

		// [!] try catch a placer en ammont, dans l'appel de cette fction
		try {
			await this.messageRepository.save(newMsg);
			const channelAfter = await this.channelService.getChannelMessages(message.channelId);
			console.log(" channelAfter : ", channelAfter);
		} catch(e) {
			console.log("crashouille : ", e);
		}



		// 2 - ajouter le message dans le tableau de la channel
		// channel.messages.push();

	}











}