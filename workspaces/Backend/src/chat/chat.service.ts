/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { channelDto } from './dto/channel.dto';
import { Socket, Server } from 'socket.io';
import { sendMsgDto } from './dto/sendMsg.dto';
import { newMsgDto } from './dto/newMsg.dto';
import { MessagesService } from 'src/messages/messages.service';
import { SocketToken } from '@/utils/typeorm/SocketToken.entity';
import { getPongieDto } from './dto/getPongie.dto';
import { EditChannelRelationDto } from '@/channels/dto/EditChannelRelation.dto';
import { Notif } from '@/utils/typeorm/Notif.entity';
import { ClearNotifDto } from './dto/clearNotif.dto';
import { NotifMessages } from '@/utils/typeorm/NotifMessages.entity';

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

    @InjectRepository(SocketToken)
    private readonly socketTokenRepository: Repository<SocketToken>,

    @InjectRepository(Notif)
    private readonly notifRepository: Repository<Notif>,

    @InjectRepository(NotifMessages)
    private readonly notifMessagesRepository: Repository<NotifMessages>,

    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
    private readonly messageService: MessagesService,
    private readonly cryptoService: CryptoService,
  ) {}

  async saveToken(token: string, userId: number) {
    try {
      const value = await this.cryptoService.encrypt(token);
      const tokenEntity = new SocketToken();
      tokenEntity.value = value;
      tokenEntity.userId = userId;

      await this.socketTokenRepository.save(tokenEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async getNotif(userId: number) {
    try {
      const user:User = await this.usersService.getUserById(userId);

      if (!user)
        throw new WsException('no user found');

      return user.notif;
    }
    catch (error) {
      console.log("ChatGateway getNotif() error : " + error.message);
      throw new WsException(error.message);
    }
  }

  async getNotifMsg(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["notif", "notif.notifMessages"],
      })

      if (!user)
        throw new WsException('no user found');

      return user.notif.notifMessages;
    }
    catch (error) {
      console.log(error.message);
      throw new WsException(error.message);
    }
  }

  async clearNotif(userId: number, toClear: ClearNotifDto, userSockets: Socket[], server: Server) {
    try {
      const user = await this.usersService.getUserById(userId);

      if (!user)
        throw new WsException('no user found');

      if (toClear.which === "redPongies") {
        const updatedNotif = user.notif.redPongies.filter(id => id !== toClear.id);
        await this.notifRepository.update(
          user.notif.id,
          { redPongies: updatedNotif },
        );

        if (userSockets.length !== 0) {
          for (const socket of userSockets) {
            server.to(socket.id).emit('notif', {
              why: 'updatePongies',
            });
          }
        }
      }

      else if (toClear.which === "redChannels") {
        const updatedNotif = user.notif.redChannels.filter(id => id !== toClear.id);
        await this.notifRepository.update(
          user.notif.id,
          { redChannels: updatedNotif },
        );
        if (userSockets.length !== 0) {
          for (const socket of userSockets) {
            server.to(socket.id).emit('notif', {
              why: 'updateChannels',
            });
          }
        }
      }

      else if (toClear.which === "messages") {

        const notifUser = user.notif;

        const notif = await this.notifRepository.findOne({
          where : { id: notifUser.id },
          relations: ['notifMessages'],
        });

        const notifMsg = notif.notifMessages.find(
          notif => notif.channelId === toClear.id
        );

        if (notifMsg)
          await this.notifMessagesRepository.remove(notifMsg);

        if (userSockets.length !== 0) {
          for (const socket of userSockets) {
            server.to(socket.id).emit('notifMsg');
          }
        }
      }
    }
    catch (error) {
      console.log(error.message);
      throw new WsException(error.message);
    }
  }

  async getLoginWithAvatar(userId: number) {
    try {
      const user = await this.usersService.getUserAvatar(userId);

      if (!user) throw new Error('no user found');

      if (user.avatar.decrypt)
        user.avatar.image = await this.cryptoService.decrypt(user.avatar.image);

      return {
        login: user.login,
        avatar: user.avatar,
      };
    } catch (error) {
      console.log(error.message);
      throw new WsException(error.message);
    }
  }

  async getChannels(userId: number) {
    try {
      const relations = await this.userChannelRelation.find({
        where: { userId: userId, isBanned: false },
        relations: [
          'channel',
          'channel.avatar',
          'channel.lastMessage',
          'channel.lastMessage.user',
        ],
      });

      if (!relations) return [];

      const channels = await Promise.all(
        relations.map(async (relation) => {
          const channel = relation.channel;
          let pongieId: number;

          if (channel.type === 'privateMsg') {
            const ids = channel.name.split(' ');
            if (userId.toString() === ids[0]) pongieId = parseInt(ids[1]);
            else pongieId = parseInt(ids[0]);

            const pongie = await this.usersService.getUserAvatar(pongieId);

            if (!pongie) throw new Error('no pongie found');

            if (pongie.avatar.decrypt)
              pongie.avatar.image = await this.cryptoService.decrypt(
                pongie.avatar.image,
              );

            channel.avatar = pongie.avatar;
            channel.name = pongie.login;
          }

          if (relation.joined === false || relation.isBanned === true) {
            channel.lastMessage = null;
          }

          return {
            ...channel,
            joined: relation.joined,
            invited: relation.invited,
            isBanned: relation.isBanned,
            isChanop: relation.isChanOp,
          };
        }),
      );

      return channels;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getChannelsProfile(userId: number) {
    try {
      const relations = await this.userChannelRelation.find({
        where: { userId: userId, isBanned: false },
        relations: [
          'channel',
          'channel.avatar',
        ],
      });

      if (!relations) return [];

      let channels = await Promise.all(
        relations.map(async (relation) => {
          const channel = relation.channel;

          if (channel.type === 'privateMsg')
            return ;

          return {
            ...channel,
            joined: relation.joined,
            invited: relation.invited,
            isBanned: relation.isBanned,
            isChanop: relation.isChanOp,
          };
        }),
      );

      channels = channels.filter(channel => channel);

      return channels;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  // [!] getChannel update !!!
  async getChannel(channelId: number, userId: number, userSockets: Socket[], server: Server) {		
      try {
        const	user = await this.usersService.getUserChannels(userId);
        const	channel = await this.channelService.getChannelById(channelId);
  
        if (!user || !channel)
          throw new Error('no channel or user found');
  
        // check if relation exists
        let relation = await this.userChannelRelation.findOne({
          where: { channelId : channelId, userId: userId },
          relations: ["user", "channel"],
        });
  
        if (!relation) {
          await this.usersService.updateUserChannels(user, channel);
          relation = await this.userChannelRelation.findOne({
            where: { channelId : channelId, userId: userId },
            relations: ["user", "channel"]
          });
        }
  
        if (!relation)
          throw new Error('cannot create relation');
  
        if (relation.isBanned)
          return {
            success: false,
            error: 'banned',
            channel: null,
          }
  
        if (channel.type === "privateMsg") {
          const	ids = channel.name.split(" ");
  
          if (ids.length !== 2)
            throw new Error("error in channel name");
  
          if (ids[0] === userId.toString()) {
            const	pongie = await this.usersService.getUserAvatar(parseInt(ids[1]));
  
            if (pongie.avatar.decrypt)
              pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
            
            channel.avatar = pongie.avatar;
            channel.name = pongie.login;
          }
          else {
            const	pongie = await this.usersService.getUserAvatar(parseInt(ids[0]));
  
            if (pongie.avatar.decrypt)
              pongie.avatar.image = await this.cryptoService.decrypt(pongie.avatar.image);
            
            channel.avatar = pongie.avatar;
            channel.name = pongie.login;
          }
        }
  
        if (!relation.joined && channel.type === "private")
            return {
              success: false,
              error: 'private',
              channel: null,
            }
  
        if (!relation.joined && channel.type === "protected")
            return {
              success: false,
              error: 'protected',
              channel: null,
            }

        if (channel.type !== "privateMsg") {
          const date = new Date();

          const msg: sendMsgDto = {
            content: `${user.login} just arrived`,
            date: date.toISOString(),
            sender: null,
            channelName: relation.channel.name,
            channelId: channelId,
            isServerNotif: true,
          };

          server.to('channel:' + channelId).emit('sendMsg', msg);
          'channel:' + channelId;
          server.to('channel:' + channelId).emit('notif', {
            why: "updateChannels",
          });
        }

        if (userSockets.length >=1) {
          for (const socket of userSockets) {
            socket.join('channel:' + channel.id);
          }
        }

        const channelRelation = {
          ...channel,
          joined: true,
          isBanned: relation.isBanned,
          invited: relation.invited,
          isChanOp: relation.isChanOp,
        }

        return {
          success: true,
          error: '',
          channel: channelRelation,
        }
    }
    catch (error) {
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
      const myRelations = await this.userChannelRelation.find({
        where: {userId: id},
        relations: ["channel"],
      });

      let all = channels.map((channel) => {
        let see = true;

        if (channel.type === 'private') see = false;

        const myRelation = myRelations.find(
          relation => relation.channel.id === channel.id,
        );

        if (myRelation)
          return {
            id: channel.id,
            name: channel.name,
            avatar: channel.avatar,
            type: channel.type,
            joined: myRelation.joined,
            invited: myRelation.invited,
            isBanned: myRelation.isBanned,
            isChanOp: myRelation.isChanOp,
          };

        if (see)
          return {
            id: channel.id,
            name: channel.name,
            avatar: channel.avatar,
            type: channel.type,
            joined: false,
            invited: false,
            isBanned: false,
            isChanOp: false,
          };
        
        return null;
      });

      all = all.filter(channel => channel);

      return all;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getAllPongies(id: number): Promise<getPongieDto[]> {
    try {
      let pongies = await this.userRepository.find({
        where: { verified: true },
        relations: ['avatar'],
      });

      pongies = pongies.filter((pongie) => pongie.id !== id);
      pongies = pongies.filter((pongie) => pongie.login && pongie.login !== '');

      const myPongies: getPongieDto[] = await this.getPongies(id, false);

      let all = await Promise.all(
        pongies.map(async (pongie) => {
          const myPongie = myPongies.find(
            (myPongie) => myPongie.id === pongie.id,
          );

          if (myPongie) {
            if (myPongie && myPongie.isBlacklisted) return;

            return {
              id: myPongie.id,
              login: myPongie.login,
              avatar: myPongie.avatar,
              isFriend: myPongie.isFriend,
              isInvited: myPongie.isInvited,
              hasInvited: myPongie.hasInvited,
              isBlacklisted: myPongie.isBlacklisted,
              hasBlacklisted: myPongie.hasBlacklisted,
            };
          }

          if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
            pongie.avatar.image = await this.cryptoService.decrypt(
              pongie.avatar.image,
            );
          }

          return {
            id: pongie.id,
            login: pongie.login,
            avatar: pongie.avatar,
            isFriend: false,
            isInvited: false,
            hasInvited: false,
            isBlacklisted: false,
            hasBlacklisted: false,
          };
        }),
      );
      
      all = all.filter(pongie => pongie);

      return all;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getPongie(userId: number, pongieId: number) {
    try {
      const pongie = await this.userRepository.findOne({
        where: { verified: true, id: pongieId },
        relations: ['avatar'],
      });

      if (!pongie)
        return {
          error: 'no pongie found',
        };

      if (pongie.avatar?.decrypt && pongie.avatar?.image?.length > 0) {
        pongie.avatar.image = await this.cryptoService.decrypt(
          pongie.avatar.image,
        );
      }

      const myPongie = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
      });

      if (myPongie) {

        if (myPongie.isBlacklisted)
          return {
            error: "blacklisted"
          };
            
        return {
          id: pongie.id,
          login: pongie.login,
          avatar: pongie.avatar,
          isFriend: myPongie.isFriend,
          isInvited: myPongie.isInvited,
          hasInvited: myPongie.hasInvited,
          isBlacklisted: myPongie.isBlacklisted,
          hasBlacklisted: myPongie.hasBlacklisted,
        };
      }

      return {
        id: pongie.id,
        login: pongie.login,
        avatar: pongie.avatar,
        isFriend: false,
        isInvited: false,
        hasInvited: false,
        isBlacklisted: false,
        hasBlacklisted: false,
      };
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getPongies(id: number, blacklisted: boolean): Promise<getPongieDto[]> {
    try {
      const relations = await this.userPongieRelation.find({
        where: { userId: id },
        relations: ['pongie', 'pongie.avatar'],
      });

      if (!relations) return [];

      let all = await Promise.all(
        relations.map(async (relation) => {
         
          if (blacklisted && relation.isBlacklisted)
            return ;
          
          if (
            relation.pongie.avatar?.decrypt &&
            relation.pongie.avatar?.image?.length > 0
          ) {
            relation.pongie.avatar.image = await this.cryptoService.decrypt(
              relation.pongie.avatar.image,
            );
          }
          return {
            id: relation.pongieId,
            login: relation.pongie.login,
            avatar: relation.pongie.avatar,
            isFriend: relation.isFriend,
            isInvited: relation.isInvited,
            hasInvited: relation.hasInvited,
            isBlacklisted: relation.isBlacklisted,
            hasBlacklisted: relation.hasBlacklisted,
          };
        }),
      );

      all = all.filter(pongie => pongie);

      return all;
    } catch (error) {
      console.log(error);
      throw new WsException(error.message);
    }
  }

  async deletePongie(
    userId: number,
    pongieId: number,
    pongieSockets: Socket[],
    userSockets: Socket[],
    server: Server,
  ) {
    try {
      const user = await this.usersService.getUserPongies(userId);
      const pongie = await this.usersService.getUserPongies(pongieId);

      if (!user || !pongie) throw new Error('no user found');

      let relationUser = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relationUser) {
        await this.usersService.updateUserPongies(user, pongie);
        relationUser = await this.userPongieRelation.findOne({
          where: { userId: userId, pongieId: pongieId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationUser) throw new Error('cannot create relation');

      let relationPongie = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserPongies(pongie, user);
        relationPongie = await this.userPongieRelation.findOne({
          where: { userId: pongieId, pongieId: userId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationPongie) throw new Error('cannot create relation');

      relationUser.isFriend = false;
      relationPongie.isFriend = false;
      relationUser.isInvited = false;
      relationPongie.isInvited = false;
      relationUser.hasInvited = false;
      relationPongie.hasInvited = false;

      await this.userPongieRelation.save(relationUser);
      await this.userPongieRelation.save(relationPongie);

      const updatedRedPongies = pongie.notif.redPongies.filter(id => id !== user.id);

      await this.notifRepository.update(
        pongie.notif.id,
        { redPongies: updatedRedPongies },
      );

      if (pongieSockets.length !== 0) {
        for (const socket of pongieSockets) {
          server.to(socket.id).emit('notif', {
            why: 'updatePongies',
          });
        }
      }

      if (userSockets.length !== 0) {
        for (const socket of userSockets) {
          server.to(socket.id).emit('notif', {
            why: 'updatePongies',
          });
        }
      }

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new WsException('cannot delete pongie');
    }
  }

  async cancelInvitation(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server) {
    try {

      const user = await this.usersService.getUserPongies(userId);
      const pongie = await this.usersService.getUserPongies(pongieId);

      if (!user || !pongie)
        throw new Error('no user found');
      
      let relationUser = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relationUser) {
        await this.usersService.updateUserPongies(user, pongie);
        relationUser = await this.userPongieRelation.findOne({
          where: { userId: userId, pongieId: pongieId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationUser)
        throw new Error("cannot create relation");

      let relationPongie = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserPongies(pongie, user);
        relationPongie = await this.userPongieRelation.findOne({
          where: { userId: pongieId, pongieId: userId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationPongie)
        throw new Error("cannot create relation");

      relationUser.isInvited = false;
      relationPongie.isInvited = false;
      relationUser.hasInvited = false;
      relationPongie.hasInvited = false;

      await this.userPongieRelation.save(relationUser);
      await this.userPongieRelation.save(relationPongie);

      const updatedRedPongies = pongie.notif.redPongies.filter(id => id !== user.id);
      await this.notifRepository.update(
        pongie.notif.id,
        { redPongies: updatedRedPongies },
      );

      if (pongieSockets.length !== 0) {
        for (const socket of pongieSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      if (userSockets.length !== 0) {
        for (const socket of userSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      return {
        success: true,
      }

    } catch (error) {
      console.log(error);
      throw new WsException('cannot delete pongie');
    }
  }

  async cancelBlacklist(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server) {
    try {

      const user = await this.usersService.getUserPongies(userId);
      const pongie = await this.usersService.getUserPongies(pongieId);

      if (!user || !pongie)
        throw new Error('no user found');
      
      let relationUser = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relationUser) {
        await this.usersService.updateUserPongies(user, pongie);
        relationUser = await this.userPongieRelation.findOne({
          where: { userId: userId, pongieId: pongieId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationUser)
        throw new Error("cannot create relation");

      let relationPongie = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserPongies(pongie, user);
        relationPongie = await this.userPongieRelation.findOne({
          where: { userId: pongieId, pongieId: userId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationPongie)
        throw new Error("cannot create relation");

      relationUser.hasBlacklisted = false;
      relationPongie.isBlacklisted = false;

      await this.userPongieRelation.save(relationUser);
      await this.userPongieRelation.save(relationPongie);

      if (pongieSockets.length !== 0) {
        for (const socket of pongieSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      if (userSockets.length !== 0) {
        for (const socket of userSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      return {
        success: true,
      }

    } catch (error) {
      console.log(error);
      throw new WsException('cannot delete pongie');
    }
  }

  async blacklist(userId: number, pongieId: number, pongieSockets: Socket[], userSockets: Socket[], server: Server) {
    try {

      const user = await this.usersService.getUserPongies(userId);
      const pongie = await this.usersService.getUserPongies(pongieId);

      if (!user || !pongie)
        throw new Error('no user found');
      
      let relationUser = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relationUser) {
        await this.usersService.updateUserPongies(user, pongie);
        relationUser = await this.userPongieRelation.findOne({
          where: { userId: userId, pongieId: pongieId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationUser)
        throw new Error("cannot create relation");

      let relationPongie = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserPongies(pongie, user);
        relationPongie = await this.userPongieRelation.findOne({
          where: { userId: pongieId, pongieId: userId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationPongie)
        throw new Error("cannot create relation");

      relationUser.hasBlacklisted = true;
      relationPongie.isBlacklisted = true;

      await this.userPongieRelation.save(relationUser);
      await this.userPongieRelation.save(relationPongie);

      if (pongieSockets.length !== 0) {
        for (const socket of pongieSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      if (userSockets.length !== 0) {
        for (const socket of userSockets) {
          server.to(socket.id).emit('notif', {
            "why": "updatePongies",
          });
        }
      }

      return {
        success: true,
      }

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

      channel.messages = await Promise.all(
        channel.messages.map(async (message) => {
          // decrypt image if needed
          if (message.user.avatar.decrypt) {
            message.user.avatar.image = await this.cryptoService.decrypt(
              message.user.avatar.image,
            );
          }

          return message;
        }),
      );

      return channel;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async addPongie(
    userId: number,
    pongieId: number,
    pongieSockets: Socket[],
    userSockets: Socket[],
    server: Server,
  ) {
    try {
      const user = await this.usersService.getUserPongies(userId);
      const pongie = await this.usersService.getUserPongies(pongieId);

      if (!user || !pongie) throw new Error('no user found');

      let relationUser = await this.userPongieRelation.findOne({
        where: { userId: userId, pongieId: pongieId },
        relations: ['user', 'pongie'],
      });

      if (!relationUser) {
        await this.usersService.updateUserPongies(user, pongie);
        relationUser = await this.userPongieRelation.findOne({
          where: { userId: userId, pongieId: pongieId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationUser) throw new Error('cannot create relation');

      if (relationUser.isBlacklisted)
        return {
          success: true,
          error: 'isBlacklisted',
          msg: '',
        };

      let relationPongie = await this.userPongieRelation.findOne({
        where: { userId: pongieId, pongieId: userId },
        relations: ['user', 'pongie'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserPongies(pongie, user);
        relationPongie = await this.userPongieRelation.findOne({
          where: { userId: pongieId, pongieId: userId },
          relations: ['user', 'pongie'],
        });
      }

      if (!relationPongie) throw new Error('cannot create relation');

      if (relationPongie.hasBlacklisted) {
        relationUser.isBlacklisted = true;
        await this.userPongieRelation.save(relationUser);
        return {
          success: true,
          error: 'isBlacklisted',
          msg: '',
        };
      }

      // if invitation already sent add Friend
      if (relationPongie.hasInvited || relationUser.isInvited) {
        // [!]HERE BEFORE !!!
        relationUser.isFriend = true;
        relationPongie.isFriend = true;
        relationUser.isInvited = false;
        relationPongie.isInvited = false;
        relationUser.hasInvited = false;
        relationPongie.hasInvited = false;
        await this.userPongieRelation.save(relationUser);
        await this.userPongieRelation.save(relationPongie);

        await this.notifRepository.update(
          pongie.notif.id,
          { redPongies: [...pongie.notif.redPongies, user.id] },
        );

        if (pongieSockets.length !== 0) {
          for (const socket of pongieSockets) {
            server.to(socket.id).emit('notif', {
              why: 'updatePongies',
            });
          }
        }

        if (userSockets.length !== 0) {
          for (const socket of userSockets) {
            server.to(socket.id).emit('notif', {
              why: 'updatePongies',
            });
          }
        }

        return {
          success: 'true',
          error: '',
          msg: 'friend',
        };
      }

      relationUser.hasInvited = true;
      relationPongie.isInvited = true;

      await this.userPongieRelation.save(relationUser);
      await this.userPongieRelation.save(relationPongie);

      await this.notifRepository.update(
        pongie.notif.id,
        { redPongies: [...pongie.notif.redPongies, user.id] },
      );

      if (pongieSockets.length !== 0) {
        for (const socket of pongieSockets) {
          server.to(socket.id).emit('notif', {
            why: 'updatePongies',
          });
        }
      }

      if (userSockets.length !== 0) {
        for (const socket of userSockets) {
          server.to(socket.id).emit('notif', {
            why: 'updatePongies',
          });
        }
      }

      return {
        success: true,
        error: '',
        msg: 'invited',
      };
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
    userSockets: Socket[],
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

        
      // check if user already joined
      if (!relation.joined) {
        relation.joined = true;
        await this.userChannelRelation.save(relation);
      }

      const date = new Date();

      const msg: sendMsgDto = {
        content: `${user.login} just arrived`,
        date: date.toISOString(),
        sender: null,
        channelName: relation.channel.name,
        channelId: channelId,
        isServerNotif: true,
      };

      server.to('channel:' + channelId).emit('sendMsg', msg);

      // Upload Data for clients in channel profile component
      server.to('channel:' + channelId).emit('editRelation', {channelId: channelId,
        newRelation: {
          joined : true,
        },
        userId: userId ,
        senderId: userId});

      this.log(`user[${userId}] joined channel ${relation.channel.name}`);

      if (userSockets.length >= 1) {
        for (const socket of userSockets) {
          socket.join('channel:' + channel.id);
          socket.emit('notif', {
            why: "updateChannels",
          });
        }
      }

      const channelRelation = {
        ...channel,
        joined: true,
        isBanned: relation.isBanned,
        invited: relation.invited,
        isChanOp: relation.isChanOp,
      }

      return {
        success: true,
        exists: false,
        banned: false,
        channel: channelRelation,
      };
    } catch (error) {
      throw new WsException(error.msg);
    }
  }

  async joinPongie(userId: number, pongieId: number, userSockets: Socket[], pongieSockets: Socket[]) {
    try {
      // check if user exists
      const user = await this.usersService.getUserChannels(userId);
      const pongie = await this.usersService.getUserChannels(pongieId);

      if (!user || !pongie) throw new Error('no user found');

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

      let relationPongie = await this.userChannelRelation.findOne({
        where: { userId: pongie.id, channelId: channel.id },
        relations: ['user', 'channel'],
      });

      if (!relationPongie) {
        await this.usersService.updateUserChannels(pongie, channel);
        relationPongie = await this.userChannelRelation.findOne({
          where: { userId: pongieId, channelId: channel.id },
          relations: ['user', 'channel'],
        });
      }

      // check if banned
      if (relationUser.isBanned || relationPongie.isBanned)
        return {
          success: false,
          exists: false,
          banned: true,
          channel: null,
        };

      if (!relationUser.joined) {
        relationUser.joined = true;
        await this.userChannelRelation.save(relationUser);
      }

      if (!relationPongie.joined) {
        relationPongie.joined = true;
        await this.userChannelRelation.save(relationPongie);
      }

      if (userSockets.length >= 1) {
        for (const socket of userSockets) {
          socket.join('channel:' + channel.id);
          socket.emit('notif', {
            why: "updateChannels",
          });
        }
      }

      if (pongieSockets.length >= 1) {
        for (const socket of pongieSockets) {
          socket.join('channel:' + channel.id);
          socket.emit('notif', {
            why: "updateChannels",
          });
        }
      }

      if (pongie.avatar.decrypt)
        pongie.avatar.image = await this.cryptoService.decrypt(
          pongie.avatar.image,
        );

      channel.name = pongie.login;
      channel.avatar = pongie.avatar;

      const channelrelation = {
        ...channel,
        joined: true,
        isBanned: relationUser.isBanned,
        invited: relationUser.invited,
        isChanop: relationUser.isChanOp,
      }

      return {
        success: true,
        exists: false,
        banned: false,
        channel: channelrelation,
      };
    } catch (error) {
      console.log(error.message);
      throw new WsException(error.message);
    }
  }

  async leave(
    userId: number,
    channelId: number,
    userSockets: Socket[],
    server: Server,
  ) {
    try {
      const relation = await this.userChannelRelation.findOne({
        where: { userId: userId, channelId: channelId },
        relations: ['user', 'channel'],
      });

      if (!relation)
        throw new Error('no relation found');

      relation.joined = false;
      await this.userChannelRelation.save(relation);

      const date = new Date();

      const msg: sendMsgDto = {
        content: `${relation.user.login} just left`,
        date: date.toISOString(),
        sender: null,
        channelName: relation.channel.name,
        channelId: channelId,
        isServerNotif: true,
      };

      // leave channel for all sockets of the user
      // update channels in the user profile
      if (userSockets.length >= 1) {
        for (const socket of userSockets) {
          socket.leave('channel:' + channelId);
          socket.emit('notif', {
            why: "updateChannels",
          });
        }
      }

      // Upload Data for clients in channel profile component
      server.to('channel:' + channelId).emit('editRelation', {channelId: channelId,
        newRelation: {
          joined : true,
        },
        userId: userId ,
        senderId: userId});

      // send message server [!]
      server.to('channel:' + channelId).emit('sendMsg', msg);

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

      await this.receiveNewMsgNotif(message.channelId, sender.id, server);

      if (sender.avatar.decrypt) {
        sender.avatar.image = await this.cryptoService.decrypt(
          sender.avatar.image,
        );
      }

      const sendMsg: sendMsgDto = {
        content: message.content,
        date: nowtoISOString,
        sender: sender,
        channelName: fetchedChannel.name,
        channelId: fetchedChannel.id,
        isServerNotif: false,
      };

      this.log(
        `[${reqUserId}] sending : [${sendMsg.content}] to : [${fetchedChannel.name}]`,
      ); // checking

      await this.messageService.addMessage(sendMsg);

      this.log(`message emit to room : 'channel:${sendMsg.channelId}'`);
      server.to('channel:' + sendMsg.channelId).emit('sendMsg', sendMsg);
      server.to('channel:' + sendMsg.channelId).emit('notif', {
        why: "updateChannels",
      });
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  private async receiveNewMsgNotif(channelId: number, userId: number, server) {
    try {
      const relations = await this.userChannelRelation.find({
        where: {
          channelId: channelId,
          userId: Not(userId),
          joined: true,
          isBanned: false,
        },
        relations: ['user', 'user.notif'],
      });

      if (relations.length >= 1) {
        for (const relation of relations) {
          const notifMessages = relation.user.notif.notifMessages.find(
            notif => notif.channelId === channelId,
          )

          if (notifMessages) {
            await this.notifMessagesRepository.update(
              notifMessages.id,
              { nbMessages: notifMessages.nbMessages + 1 },
            );
          }
          else {
            const notifMessage = new NotifMessages();

            notifMessage.channelId = channelId;
            notifMessage.nbMessages = 1;
            notifMessage.notif = relation.user.notif;

            await this.notifMessagesRepository.save(notifMessage);
          }
        }
      }
      server.to("channel:" + channelId).emit("notifMsg")
    }
    catch (error) {
      console.log(error);
    }
  }

  async joinAllMyChannels(socket: Socket, userId: number) {
    const relations = await this.userChannelRelation.find({
      where: { userId: userId, joined: true, isBanned: false },
    });

    relations.map((relation) => {
      socket.join('channel:' + relation.channelId);
    });
  }

  async sendEditRelationNotif(
    infos: EditChannelRelationDto & { server: Server; from: number },
  ) {
    const content: string = await this.makeEditRelationNotifContent(infos);
    this.sendServerNotifMsg(
      infos.channelId,
      content,
      infos.server,
    );
  }

  // tools
  private sendServerNotifMsg(
    channelId: number,
    content: string,
    server: Server,
  ) {
    try {
      const now = new Date();
      const nowtoISOString = now.toISOString();

      const notif: sendMsgDto = {
        content: content,
        date: nowtoISOString,
        sender: undefined,
        channelName: '',
        channelId: channelId,
        isServerNotif: true,
      };

      server.to('channel:' + channelId).emit('sendMsg', notif);
    } catch (e) {
      this.log('Error : ' + e.message);
    }
  }

  async makeEditRelationNotifContent(
    infos: EditChannelRelationDto & { server: Server; from: number },
  ) {
    let content: string = '';
    let needEnd:boolean = true;

    try {
      const isSelf: boolean = infos.from === infos.userId;
      const whoFrom = await this.usersService.getUserById(infos.from);
      const whotTo = isSelf
        ? whoFrom
        : await this.usersService.getUserById(infos.userId);

      if (!whoFrom) throw new Error("can't find the edit relation maker");
      if (!whotTo) throw new Error("can't find the edit relation target");

      let action: string;

      if (infos.newRelation.isChanOp === true) {
        action = 'grants channel Operator privilege';
      } else if (infos.newRelation.isChanOp === false) {
        action = 'removes channel Operator privilege';
      } else if (infos.newRelation.isBanned === true) {
        action = 'gives a ban penalty';
      } else if (infos.newRelation.isBanned === false) {
        action = 'removes the ban penalty';
      } else if (infos.newRelation.joined === true && !isSelf) {
        action = 'allows joinning channel';
      } else if (infos.newRelation.joined === true && isSelf) {
        action = 'just joined the channel';
        needEnd = false;
      } else if (infos.newRelation.joined === false && !isSelf) {
        action = 'gives a channel kick';
      } else if (infos.newRelation.joined === false && isSelf) {
        action = 'left channel';
        needEnd = false;
      } else if (infos.newRelation.invited === true) {
        action = 'gives a channel invitation';
      } else if (infos.newRelation.invited === false) {
        action = 'cancels the channel invitation';
      } else {
        throw new Error('no relation boolean found');
      }

      if (isSelf) {
        content = needEnd ?
        `${whoFrom.login} ${action} to itself` :
        `${whoFrom.login} ${action}`;
      } else {
        content = needEnd ? 
        `${whoFrom.login} ${action} to ${whotTo.login}`:
        `${whoFrom.login} ${action}`;
      }

    } catch (e) {
      this.log('makeEditRelationNotifContent() error : ' + e.message);
    }

    return content;
  }

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const green = '\x1b[32m';
    const stop = '\x1b[0m';

    process.stdout.write(green + '[chat service]  ' + stop);
    console.log(message);
  }
}
