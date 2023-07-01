/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channels/channel.service';
import { CreatePrivateMsgChannelDto } from 'src/channels/dto/CreatePrivateMsgChannel.dto';
import { UsersService } from 'src/users/users.service';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
  ) {}

  async getChannels(id: string) {
    const user = await this.usersService.getUserChannels(parseInt(id));

    if (!user)
      return {
        success: 'false',
        channels: [],
      };

    return {
      success: 'true',
      channels: user.channels,
    };
  }

  async joinOrCreatePrivateMsgChannel(userId: string, pongieId: string) {
    console.log('UserID : ', userId);
    console.log('pongieID : ', pongieId);

    let channel:CreatePrivateMsgChannelDto;

    try {

    
    // verification si la channel n'existe pas deja (dans les tables)
    // creation de la channel apres verif
    channel = await this.channelService.joinOrCreatePrivateMsgChannel(userId, pongieId);
    
    // join la room => nom de room : ( idlower + ' ' + idhigher )
    

  } catch (e) {
    return {
      success: 'false',
      message: 'creatPrivateMessageChannel failed : ' + e.message,
    };
  }

    return {
      success: 'true',
      channel: channel,
    };
  }

  async getPongies(id: string) {
	const	user = await this.usersService.getUserPongies(parseInt(id));

	if (!user)
		return {
      "success": "false",
      "pongies": [],
    }
  
	return {
      "success": "true",
      "pongies": user.pongies,
    };
  }
}
