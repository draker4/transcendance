/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { ChannelService } from 'src/channels/channel.service';
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
import { sendMsgDto } from './dto/sendMsg.dto';
import { newMsgDto } from './dto/newMsg.dto';
import { MessagesService } from 'src/messages/messages.service';

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
    private readonly messageService: MessagesService,
    private readonly cryptoService: CryptoService,
  ) {}

  async getChannels(id: number) {
    try {
      const relations = await this.userChannelRelation.find({
        where: { userId: id, joined: true, isBanned: false },
        relations: ['channel', 'channel.avatar'],
      });

      if (!relations) return [];

      const channels = await Promise.all(
        relations.map(async (relation) => {
          const channel = relation.channel;
          let pongieId: number;

          if (channel.type === 'privateMsg') {
            const ids = channel.name.split(' ');
            if (id.toString() === ids[0]) pongieId = parseInt(ids[1]);
            else pongieId = parseInt(ids[0]);

            const pongie = await this.usersService.getUserAvatar(pongieId);

            if (!pongie) throw new Error('no pongie found');

            channel.avatar = pongie.avatar;
            channel.name = pongie.login;
          }

          return channel;
        }),
      );

      return channels;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllChannels(id: number): Promise<channelDto[]> {
    try {
      // get all channels
      const channels = await this.channelRepository.find({
        relations: ['avatar'],
        where: { type: Not('privateMsg') },
      });

      // get channels already joined
      const channelsJoined = await this.getChannels(id);

      const all = channels.map((channel) => {
        let joined = false;
        let see = true;

        if (channel.type === 'private') see = false;

        const channelJoined = channelsJoined.find(
          (channelJoined) => channelJoined.id === channel.id,
        );

        if (channelJoined) {
          joined = true;
          see = true;
        }

        if (see)
          return {
            id: channel.id,
            name: channel.name,
            avatar: channel.avatar,
            type: channel.type,
            joined: joined,
          };
      });

      // console.log(all);
      return all;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllPongies(id: number): Promise<pongieDto[]> {
    try {
      let pongies = await this.userRepository.find({
        relations: ['avatar'],
      });

      pongies = pongies.filter((pongie) => pongie.id !== id);

      const friends = await this.getPongies(id);

      const all = await Promise.all(
        pongies.map(async (pongie) => {
          let isFriend = false;

          if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
            pongie.avatar.image = await this.cryptoService.decrypt(
              pongie.avatar.image,
            );
            pongie.avatar.decrypt = false;
          }

          if (friends.find((friend) => friend.id === pongie.id))
            isFriend = true;

          return {
            id: pongie.id,
            login: pongie.login,
            avatar: pongie.avatar,
            isFriend: isFriend,
          };
        }),
      );

      return all;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getPongies(id: number) {
    try {
      const relations = await this.userPongieRelation.find({
        where: { userId: id, deleted: false, isFriend: true },
        relations: ['pongie', 'pongie.avatar'],
      });

      if (!relations) return [];

      const pongies = await Promise.all(
        relations.map(async (relation) => {
          if (
            relation.pongie.avatar?.decrypt &&
            relation.pongie.avatar?.image?.length > 0
          ) {
            relation.pongie.avatar.image = await this.cryptoService.decrypt(
              relation.pongie.avatar.image,
            );
            relation.pongie.avatar.decrypt = false;
          }
          return relation.pongie;
        }),
      );

      return pongies;
    } catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }

  async deletePongie(userId: number, pongieId: number) {
    try {
      const relation1 = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
      });

      const relation2 = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
      });

      relation1.deleted = true;
      relation2.deleted = true;

      await this.userPongieRelation.save(relation1);
      await this.userPongieRelation.save(relation2);
    } catch (error) {
      console.log(error);
      throw new WsException('cannot delete pongie');
    }
  }

  async addChannel(userId: number, channelId: number) {
    try {
      const relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channelId },
        relations: ['user', 'channel'],
      });

      if (!relation) {
        const user = await this.usersService.getUserPongies(userId);
        const channel = await this.channelService.getChannelById(channelId);

        await this.usersService.updateUserChannels(user, channel);
      }
      // else {
      //   await this.userPongieRelation.save(relation);
      // }
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getChannelUsers(channelId: number): Promise<User[]> {
    return (await this.channelService.getChannelUsers(channelId)).users;
  }

  async getChannelById(channelId: number): Promise<Channel> {
    return await this.channelService.getChannelById(channelId);
  }

  async getMessages(channelId: number) {
    try {
      const channel = await this.channelService.getChannelMessages(channelId);

      channel.messages = await Promise.all(channel.messages.map(async (message) => {

        // decrypt image if needed
        if (message.user.avatar.decrypt) {
          message.user.avatar.image = await this.cryptoService.decrypt(message.user.avatar.image);
        }

        return message;
      }));

      return channel;
    }
    catch (error) {
      throw new WsException(error.message);
    }
  }

  async addPongie(userId: number, pongieId: number) {
    try {
      const relation = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relation) {
        const user = await this.usersService.getUserPongies(userId);
        const pongie = await this.usersService.getUserPongies(pongieId);

        await this.usersService.updateUserPongies(user, pongie);
      } else {
        relation.invited = true;
        relation.deleted = false;

        await this.userPongieRelation.save(relation);
      }

      const relation2 = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relation2) {
        const user = await this.usersService.getUserPongies(userId);
        const pongie = await this.usersService.getUserPongies(pongieId);

        await this.usersService.updateUserPongies(user, pongie);
      } else {
        relation2.invited = true;
        relation2.deleted = false;

        await this.userPongieRelation.save(relation2);
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // check before if channel exists
  async joinChannel(
    userId: number,
    channelId: number,
    channelName: string,
    channelType: 'public' | 'protected' | 'private' | 'privateMsg',
    socket: Socket,
    server: Server,
  ) {
    try {
      // check if user exists
      const user = await this.usersService.getUserChannels(userId);
      if (!user) throw new Error('no user found');

      // check if channel already exists
      let channel = await this.channelService.getChannelById(channelId);

      if (!channel) {
        channel = await this.channelService.addChannel(
          channelName,
          channelType,
        );

        if (!channel)
          return {
            success: false,
            exists: true,
            banned: false,
            channel: null,
          };
      }

      // check if user already in channel
      let relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channelId },
        relations: ['user', 'channel'],
      });

      if (!relation) {
        await this.usersService.updateUserChannels(user, channel);
        relation = await this.userChannelRelation.findOne({
          where: { userId: userId, channelId: channel.id },
          relations: ['user', 'channel'],
        });
      }

      // check if user banned
      if (relation.isBanned)
        return {
          success: false,
          exists: false,
          banned: true,
          channel: null,
        };

      const date = new Date();

      const msg: sendMsgDto = {
        content: `${user.login} just arrived`,
        date: date.toISOString(),
        sender: user,
        channelName: relation.channel.name,
        channelId: channelId,
      };

      server.to('channel:' + channelId).emit('sendMsg', msg);
      'channel:' + channelId;
      socket.emit('notif');

      // check if user already joined
      if (!relation.joined) {
        relation.joined = true;
        await this.userChannelRelation.save(relation);
      }

      return {
        success: true,
        exists: false,
        banned: false,
        channel: channel,
      };
    } catch (error) {
      throw new WsException(error.msg);
    }
  }

  async joinPongie(userId: number, pongieId: number, socket: Socket) {
    try {
      // check if user exists
      const user = await this.usersService.getUserChannels(userId);
      const pongie = await this.usersService.getUserChannels(pongieId);
      
      if (!user || !pongie)
        throw new Error('no user found');

      // check if channel of type 'privateMsg' already exists
      const channelName = this.channelService.formatPrivateMsgChannelName(
        userId.toString(),
        pongieId.toString(),
      );
      let channel = await this.channelService.getChannelByName(
        channelName,
        true,
      );

      if (!channel)
        channel = await this.channelService.addChannel(
          channelName,
          'privateMsg',
        );

      // check if relations exists
      let relationUser = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channel.id },
        relations: ['user', 'channel'],
      });

      if (!relationUser) {
        await this.usersService.updateUserChannels(user, channel);
        relationUser = await this.userChannelRelation.findOne({
          where: { userId: userId, channelId: channel.id },
          relations: ['user', 'channel'],
        });
      }

      // check if banned
      if (relationUser.isBanned)
        return {
          success: false,
          exists: false,
          banned: true,
          channel: null,
        };

      socket.join('channel:' + channelName);
      socket.emit('notif');

      if (!relationUser.joined) {
        relationUser.joined = true;
        await this.userChannelRelation.save(relationUser);
      }
      
      channel.name = pongie.login;

      console.log(channel);
      return {
        success: true,
        exists: false,
        banned: false,
        channel: channel,
      };
    } catch (error) {
      throw new WsException(error.msg);
    }
  }

  async leave(
    userId: number,
    channelId: number,
    socket: Socket,
    server: Server,
  ) {
    try {
      const relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channelId },
        relations: ['user', 'channel'],
      });

      if (!relation) throw new Error('no relation found');

      relation.joined = false;
      await this.userChannelRelation.save(relation);

      socket.leave('channel:' + channelId);
      socket.emit('notif');

      // send message server [!]
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async receiveNewMsg(message: newMsgDto, reqUserId: number, server: Server) {
    try {
      const now = new Date();
      const nowtoISOString = now.toISOString();
      const [fetchedChannel, sender] = await Promise.all([
        this.channelService.getChannelById(message.channelId),
        this.usersService.getUserAvatar(reqUserId),
      ]);

      const sendMsg: sendMsgDto = {
        content: message.content,
        date: nowtoISOString,
        sender: sender,
        channelName: fetchedChannel.name,
        channelId: fetchedChannel.id,
      };

      this.log(
        `[${reqUserId}] sending : [${sendMsg.content}] to : [${fetchedChannel.name}]`,
      ); // checking

      this.messageService.addMessage(sendMsg);

      if (fetchedChannel.type === 'privateMsg') {
        this.log(`message emit to room : 'channel:${sendMsg.channelName}'`);
        server.to('channel:' + sendMsg.channelName).emit('sendMsg', sendMsg);
      } else {
        this.log(`message emit to room : 'channel:${sendMsg.channelId}'`);
        server.to('channel:' + sendMsg.channelId).emit('sendMsg', sendMsg);
      }
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // tools
  
  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const green = '\x1b[32m';
    const stop = '\x1b[0m';

    process.stdout.write(green + '[chat service]  ' + stop);
    console.log(message);
  }
}
