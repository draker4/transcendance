/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ChannelService } from 'src/channels/channel.service';
import { sendMsgDto } from 'src/chat/dto/sendMsg.dto';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { Message } from 'src/utils/typeorm/Message.entity';
import { Repository } from 'typeorm';
import { AddMsgDto } from './dto/saveNewMsg.dto';

@Injectable()
export class MessagesService {

	constructor(
		@InjectRepository(Message)
		private readonly messageRepository : Repository<Message>,
		
		// ajouter aussi Channel Repo ?
		// @InjectRepository(Channel)
		// private readonly channelRepository: Repository<Channel>,
		private readonly channelService: ChannelService,
		
		// et apres userRepo ?
		
	) {}

	async addMessage(message:sendMsgDto) {
		console.log("pshhhhhhehhshhhzzzz surpression du cerveau");
		console.log("message : ", message);

		// 1 - creer le message et l'enregistrer dans sa table

		// besoin de l'objet channel concerne [+] avec sa relation message
		const channel = await this.channelService.getChannelById(message.channelId);
		if (!channel)
			throw new WsException("Database can't find " + message.channelName);

			// besoin du dto de nouveau msg
			const newMsg :AddMsgDto = {
				content: message.content,
				channel: channel,
			}

			try {
				await this.messageRepository.save(newMsg);
			} catch(e) {
				console.log("crashouille : ", e);
			}



		// 2 - ajouter le message dans le tableau de la channel
		// channel.messages.push();

	}











}
