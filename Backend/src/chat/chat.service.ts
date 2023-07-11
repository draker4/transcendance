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
import { Not, Repository } from 'typeorm';
import { pongieDto } from './dto/pongie.dto';
import { channelDto } from './dto/channel.dto';
import { Socket, Server } from 'socket.io';
import { newMsgDto } from './dto/newMsg.dto';
import { sendMsgDto } from './dto/sendMsg.dto';

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

  async getChannels(id: number) {
    try {
      const relations = await this.userChannelRelation.find({
        where: { userId: id, joined: true },
        relations: ["channel", "channel.avatar"],
      });

      if (!relations)
        return [];

      const channels = await Promise.all(relations.map(async (relation) => {
        return relation.channel;
      }));
  
      return channels;
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllChannels(id: number): Promise<channelDto[]>{
    try {

      const channels = await this.channelRepository.find({
        relations: ["avatar"],
        where: { type: Not("privateMsg") },
      });

      const channelsJoined = await this.getChannels(id);

      const all = await Promise.all(channels.map(async (channel) => {
        let joined = false;

        if (channelsJoined.find((channelJoined) => {
          channelJoined.id === channel.id
        }))
          joined = true;

        return {
          id: channel.id,
          name: channel.name,
          avatar: channel.avatar,
          type: channel.type,
          joined: joined,
        };
      }));

      return all;
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllPongies(id: number): Promise<pongieDto[]> {
    try {
      let pongies = await this.userRepository.find({
        relations: ["avatar"],
      });

      pongies = pongies.filter(pongie => pongie.id !== id);

      const friends = await this.getPongies(id);

      const all = await Promise.all(pongies.map(async (pongie) => {
        let isFriend = false;

        if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
          pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
          pongie.avatar.decrypt = false;
        }

        if (friends.find(friend => friend.id === pongie.id))
          isFriend = true;

        return {
          id: pongie.id,
          login: pongie.login,
          avatar: pongie.avatar,
          isFriend: isFriend,
        };
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


  async getPongies(id: number) {
    try {

      const relations = await this.userPongieRelation.find({
        where: { userId: id, deleted: false, isFriend: true },
        relations: ["pongie", "pongie.avatar"],
      });

      if (!relations)
        return [];

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

  // check before if channel exists
  async joinChannel(
    userId: number,
    channelId: string,
    channelName: string,
    socket: Socket,
    server: Server,
  ) {
    try {
      // check if user already in channel
      const relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: parseInt(channelId) },
        relations: ["user", "channel"],
      });

      const user = await this.usersService.getUserChannels(userId);

      // if relation already exists
      if (relation) {
        
        // check if user banned
        if (relation.isbanned)
          return ;
        
        // check if user already joined
        if (relation.joined)
          return ;
        
        // join channel
        relation.joined = true;
        await this.userChannelRelation.save(relation);
        
        const date = new Date();

        const msg: sendMsgDto = {
          content: `${user.login} just arrived`,
          date: date.toISOString(),
          senderId: userId,
        };

        server.to("channel:" + channelId).emit("onMessage", msg);
        socket.join("channel:" + channelId);

        return ;
      }

      // add channel to the user
      const channel = await this.channelService.getChannelById(parseInt(channelId));

      if (!channel)
        throw new Error('no channel found');
      
      return await this.usersService.updateUserChannels(user, channel);
    }
    catch (error) {
      throw new WsException(error.msg);
    }
  }

  async joinPongie(userId: number, pongieId: string, socket: Socket, server: Server) {

  }
}
