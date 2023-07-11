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
    let channel:CreatePrivateMsgChannelDto;

    try {
    // verification si la channel n'existe pas deja (dans les tables)
    // creation de la channel apres verif
    channel = await this.channelService.joinOrCreatePrivateMsgChannel(userId, pongieId);
    
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

      const relations = await this.userPongieRelation.find({
        where: { userId: parseInt(id), deleted: false },
        relations: ["pongie", "pongie.avatar"],
      });

      if (!relations)
        throw new WsException("no relations found");

      const pongies = await Promise.all(relations.map(async (relation) => {
        if (relation.pongie.avatar?.decrypt && relation.pongie.avatar?.image?.length > 0) {
          relation.pongie.avatar.image = await this.cryptoService.decrypt(relation.pongie.avatar.image);
          relation.pongie.avatar.decrypt = false;
        }
        return relation.pongie;
      }));
  
      return pongies;
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }

  async deletePongie(userId: number, pongieId: number) {
    try {

      const relation1 = await this.userPongieRelation.findOne({
        where: {userId: userId, pongieId: pongieId}
      });

      const relation2 = await this.userPongieRelation.findOne({
        where: {userId: pongieId, pongieId: userId}
      });

      relation1.deleted = true;
      relation2.deleted = true;

      await this.userPongieRelation.save(relation1);
      await this.userPongieRelation.save(relation2);

    }
    catch (error) {
      console.log(error);
      throw new WsException("cannot delete pongie");
    }
  }

  async addChannel(userId: number, channelId: number) {
    try {
      const relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channelId},
        relations: ["user", "channel"],
      });

      if (!relation) {
        const user = await this.usersService.getUserPongies(userId);
        const channel = await this.channelService.getChannelById(channelId);
       
        await this.usersService.updateUserChannels(user, channel);
      }
      // else {
      //   await this.userPongieRelation.save(relation);
      // }
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }

  async addPongie(userId: number, pongieId: number) {
    try {
      const relation = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId},
        relations: ["user", "pongie"],
      });

      if (!relation) {
        const user = await this.usersService.getUserPongies(userId);
        const pongie = await this.usersService.getUserPongies(pongieId);
        
        await this.usersService.updateUserPongies(user, pongie);
      }
      else {
        relation.invited = true;
        relation.deleted = false;

        await this.userPongieRelation.save(relation);
      }

      const relation2 = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ["user", "pongie"],
      });

      if (!relation2) {
        const user = await this.usersService.getUserPongies(userId);
        const pongie = await this.usersService.getUserPongies(pongieId);

        await this.usersService.updateUserPongies(user, pongie);
      }
      else {
        relation2.invited = true;
        relation2.deleted = false;

        await this.userPongieRelation.save(relation2);
      }
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }
  /* ------------PRIVATE MSG------------------- */

  checkPrivateMsgId(id:number, channelName:string):boolean {
    if (channelName.split(" ").length > 2)
      return false;

    const [id1, id2] = channelName.split(" ", 2);
    
    return (id === parseInt(id1) || id === parseInt(id2));
  }
}
