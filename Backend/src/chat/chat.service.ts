/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ChannelService } from 'src/channels/channel.service';
import { CreatePrivateMsgChannelDto } from 'src/channels/dto/CreatePrivateMsgChannel.dto';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils/crypto/crypto';
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
    private readonly cryptoService: CryptoService,
  ) {}

  async getChannels(id: string) {
    try {
      const user = await this.usersService.getUserChannels(parseInt(id));

      if (!user)
        throw new WsException('no user found');

      return {
        success: true,
        channels: user.channels,
      };
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }

  async getAllChannels() {
    try {
      const channels = await this.channelRepository.find({
        relations: ["avatar"],
      });
      throw new WsException("test");
      const all = channels.map((channel) => {
        return {
          id: channel.id,
          name: channel.name,
          avatar: channel.avatar,
        }
      })

      return {
        success: true,
        channels: all,
      };
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllPongies(id: string) {
    try {
      const pongies = await this.userRepository.find({
        relations: ["avatar"],
      });

      const all = await Promise.all(pongies.map(async (pongie) => {
        if (pongie.id === parseInt(id))
          return ;

        if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
          pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
          pongie.avatar.decrypt = false;
        }

        return {
          id: pongie.id,
          login: pongie.login,
          avatar: pongie.avatar,
        }
      }));

      return {
        success: true,
        pongies: all,
      };
    }
    catch (error) {
      throw new WsException(error.message);
    }
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
    try {
      const	user = await this.usersService.getUserPongies(parseInt(id));

      if (!user)
        throw new WsException("no user found");

      const pongies = await Promise.all(user.pongies.map(async (pongie) => {
        if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
          pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
          pongie.avatar.decrypt = false;
        }
        return pongie;
      }));
  
      return {
          success: true,
          pongies: pongies,
        };
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }
}
