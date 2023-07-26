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
    private readonly messageRepository: Repository<Message>,

    private readonly channelService: ChannelService,
    private readonly userService: UsersService,
  ) {}

  async addMessage(message: sendMsgDto) {
    const channel = await this.channelService.getChannelById(message.channelId);

    if (!channel || !message.sender)
      throw new WsException("Database can't find " + message.channelName);

    const newMsg: saveNewMsgDto = {
      content: message.content,
      channel: channel,
      user: message.sender,
    };

    const messageSaved = await this.messageRepository.save(newMsg);

    await this.channelService.saveLastMessage(channel.id, messageSaved);
  }
}
