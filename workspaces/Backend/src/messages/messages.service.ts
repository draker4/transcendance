/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channels/channel.service';
import { Message } from 'src/utils/typeorm/Message.entity';
import { Repository } from 'typeorm';
import { MakeMessage } from './dto/makeMessage';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly channelService: ChannelService,
  ) {}

  async addMessage(message: MakeMessage) {
    try {
      // const channel = await this.channelService.getChannelById(message.channelId);
  
      if (!message.channel || (!message.user && !message.isServerNotif))
        throw new Error(`Database can't find channel[${message.channel.name}]`);
      else if (!message.user && !message.isServerNotif)
        throw new Error(`Error message server notif type`);

        
      const messageSaved = await this.messageRepository.save(message);
        
      if (!message.isServerNotif) {
        await this.channelService.saveLastMessage(message.channel.id, messageSaved);
      }
    } catch(error) {
      this.log(error.message);
    }
  }



  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const gray = '\x1b[90m';
    const stop = '\x1b[0m';

    process.stdout.write(gray + '[MessageService]  ' + stop);
    console.log(message);
  }
}
