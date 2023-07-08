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
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { UserPongieRelation } from 'src/utils/typeorm/UserPongieRelation';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(UserPongieRelation)
    private readonly userPongieRelation: Repository<UserPongieRelation>,
    @InjectRepository(UserChannelRelation)
    private readonly userChannelRelation: Repository<UserChannelRelation>,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
    private readonly cryptoService: CryptoService,
  ) {}

  async getChannels(id: string) {
    try {
      const user = await this.usersService.getUserChannels(parseInt(id));

      console.log("channels");

      if (!user)
        throw new WsException('no user found');

      return user.channels;
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

      const all = channels.map((channel) => {
        return {
          id: channel.id,
          name: channel.name,
          avatar: channel.avatar,
        }
      })

      return all;
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

      return all;
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

  console.log("joinOrCreatePrivateMsgChannel() is ok, channel is : ", channel);
    return {
      success: 'true',
      channel: channel,
    };
  }





  async getPongies(id: string) {
    try {
      const	user = await this.usersService.getUserPongies(parseInt(id));

      console.log("pongies");

      if (!user)
        throw new WsException("no user found");

      const pongies = await Promise.all(user.pongies.map(async (pongie) => {
        if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
          pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
          pongie.avatar.decrypt = false;
        }
        return pongie;
      }));
  
      return pongies;
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }

  /* ------------PRIVATE MSG------------------- */

  checkPrivateMsgId(id:number, channelName:string):boolean {
    if (channelName.split(" ").length > 2)
      return false;

      
    const [id1, id2] = channelName.split(" ", 2);
    console.log("id : ", id);
      console.log("id1 : ", id1);
      console.log("id2 : ", id2);
      console.log("(id === id1 || id === id2) : ", (id === parseInt(id1) || id === parseInt(id2)));


    return (id === parseInt(id1) || id === parseInt(id2));
  }
}
