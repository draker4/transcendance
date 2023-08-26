/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ChannelDto } from './dto/Channel.dto';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Channel } from 'src/utils/typeorm/Channel.entity';
import { User } from 'src/utils/typeorm/User.entity';
import { UserChannelRelation } from 'src/utils/typeorm/UserChannelRelation';
import { Message } from '@/utils/typeorm/Message.entity';
import { EditChannelRelationDto } from './dto/EditChannelRelation.dto';
import { PongColors } from '@/utils/enums/PongColors.enum';
import { Socket, Server } from 'socket.io';
import { UsersService } from '@/users/users.service';

type ChannelAndUsers = {
  channel: Channel;
  usersRelation: UserChannelRelation[];
};

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    @InjectRepository(UserChannelRelation)
    private readonly userChannelRelation: Repository<UserChannelRelation>,
    private readonly usersService: UsersService,
  ) {}

  async getChannelByName(name: string, privateMsg: boolean) {
    if (privateMsg)
      return await this.channelRepository.findOne({
        where: { name: name, type: 'privateMsg' },
        relations: ['avatar'],
      });
    return await this.channelRepository.findOne({
      where: { name: name, type: Not('privateMsg') },
      relations: ['avatar'],
    });
  }

  async addChannel(
    channelName: string,
    type: 'public' | 'protected' | 'private' | 'privateMsg',
    password?: string
  ) {
    const channel = await this.getChannelByName(channelName, false);

    if (channel) return null;

    const colors = Object.values(PongColors);
    const random1 = Math.floor(Math.random() * colors.length);
    const random2 = Math.floor(Math.random() * colors.length);
    const borderColor = colors[random1];
    const backgroundColor = colors[random2];

    const text = channelName.length > 3 ? channelName.slice(0, 3) : channelName;

    const avatar = await this.avatarRepository.save({
      name: channelName,
      image: '',
      text: text,
      variant: 'rounded',
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      empty: false,
      isChannel: true,
      decrypt: false,
    });

    const newChannel: ChannelDto = {
      name: channelName,
      avatar: avatar,
      type: type,
      password:password,
    };
    return await this.channelRepository.save(newChannel);
  }

  // name of Private Message channel format
  // 'id1 id2' with id1 < id2
  public formatPrivateMsgChannelName(id1: string, id2: string): string {
    const lower: string = id1 < id2 ? id1 : id2;
    const higher: string = id1 > id2 ? id1 : id2;

    return lower + ' ' + higher;
  }

  public async getChannelbyName(name: string): Promise<Channel> {
    return await this.channelRepository.findOne({ where: { name: name } });
  }

  public async getChannelById(id: number): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: { id: id },
      relations: ['avatar'],
    });
  }

  public async getChannelAvatar(id: number): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: { id: id },
      relations: ['avatar'],
    });
  }

  public async getChannelMessages(id: number): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: { id: id },
      relations: ['messages', 'messages.user', 'messages.user.avatar'],
    });
  }

  public async getChannelUsers(id: number): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: { id: id },
      relations: ['users', 'users.avatar'],
    });
  }

  public async getChannelUsersRelations(userId: number, channelId: number): Promise<ChannelAndUsers> {
    const channel: Channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['users', 'users.avatar'],
    });

    const usersRelation: UserChannelRelation[] =
      await this.userChannelRelation.find({
        where: { channelId: channelId },
        relations: ['user', 'user.avatar'],
      });

    let hidePassword: boolean = true;
    usersRelation.forEach((relation) => {
      if (relation.userId === userId && relation.isBoss)
        hidePassword = false;
    });

    if (hidePassword && channel && channel.password)
      channel.password = "";

    return {
      channel: channel,
      usersRelation: usersRelation,
    };
  }

  public async getOneChannelUserRelation(
    userId: number,
    channelId: number,
  ): Promise<ReturnDataTyped<UserChannelRelation>> {
    const rep: ReturnDataTyped<UserChannelRelation> = {
      success: false,
      message: '',
    };

    try {
      const usersRelations: UserChannelRelation[] =
        await this.userChannelRelation.find({
          where: { channelId: channelId },
        });

      if (!usersRelations)
        throw new Error(`User Relations of Channel[${channelId}] not found`);

      const relation: UserChannelRelation | undefined = usersRelations.find(
        (rel) => rel.userId === userId,
      );

      if (!relation)
        throw new Error(
          `user[${userId}] relation not found with Channel[${channelId}]`,
        );

      rep.success = true;
      rep.data = relation;
    } catch (e: any) {
      this.log(`getOneChannelUserRelation error : `);
      console.log("error (object) : ", e);
      rep.error = e;
      rep.message = e.message;
    }

    return rep;
  }

  public async checkEditAuthorization(
    userId: number,
    edit: EditChannelRelationDto,
  ): Promise<ReturnData> {
    const rep: ReturnData = {
      success: false,
      message: '',
    };

    let isSpecialCase: boolean;

    try {
      if (userId === edit.userId) {
        const repSpecial = await this.checkEditRelationSpecialCase(userId, edit);
        if (!repSpecial.success)
            throw new Error(repSpecial.message);
        else
            isSpecialCase = repSpecial.data;
      } else isSpecialCase = false;

      const check = await this.checkChanOpPrivilege(userId, edit.channelId);

      if (edit.newRelation && 'isBoss' in edit.newRelation) {
        const checkBoss = await this.checkChannelMasterPrivilege(
          userId,
          edit.channelId,
        );
        if (!checkBoss) throw new Error(checkBoss.error);
      }

      if (!isSpecialCase && !check.isOk) throw new Error(check.error);

      rep.success = true;
    } catch (error) {
      rep.success = false;
      rep.error = error;
      rep.message = error.message;
    }

    return rep;
  }

  public async checkChanOpPrivilege(
    userId: number,
    channelId: number,
  ): Promise<{ isOk: boolean; error?: string }> {
    try {
      const relation: UserChannelRelation =
        await this.privateGetOneChannelUserRelation(userId, channelId);

      this.verifyPermissions(userId, channelId, relation);
      return {
        isOk: true,
      };
    } catch (error) {
      return {
        isOk: false,
        error: error.message,
      };
    }
  }

  private async checkChannelMasterPrivilege(
    userId: number,
    channelId: number,
  ): Promise<{ isOk: boolean; error?: string }> {
    try {
      const relation: UserChannelRelation =
        await this.privateGetOneChannelUserRelation(userId, channelId);
      if (!relation)
        throw new Error(
          `channel(id: ${channelId}) has no relation with user(id: ${userId})`,
        );
      if (!relation.isBoss)
        throw new Error(`channel Master privilege required`);
    } catch (e) {
      return {
        isOk: false,
        error: e.message,
      };
    }

    return { isOk: true };
  }

  // the user is himself, already checked
  private async checkEditRelationSpecialCase(
    userId: number,
    edit: EditChannelRelationDto,
  ): Promise<ReturnDataTyped<boolean>> {
    const rep: ReturnDataTyped<boolean> = {
      success: false,
      message: '',
    };

    try {
      const relation: UserChannelRelation =
        await this.privateGetOneChannelUserRelation(userId, edit.channelId);
      if (!relation)
        throw new Error(
          `relation not found between user[${userId}] and channel[${edit.channelId}]`,
        );

      // [0] if no if match, its not a special case
      rep.data = false;

      /* Special cases where chanOp privileges are not required */
      // [1] a User can change himself his joined relation to a channel
      if (
        !('isChanOp' in edit.newRelation) &&
        !('isBanned' in edit.newRelation) &&
        !('invited' in edit.newRelation)
      ) {
        rep.data = true;
      }

      // [2] An invited user can join then consume his invitation
      if (
        !('isChanOp' in edit.newRelation) &&
        !('isBanned' in edit.newRelation) &&
        relation.invited === true &&
        edit.newRelation.invited === false &&
        edit.newRelation.joined === true
      ) {
        rep.data = true;
      }

      // [4] A user can leave a channel AND/OR switch invited to false
      if (
        !('isChanOp' in edit.newRelation) &&
        !('isBanned' in edit.newRelation) &&
        (relation.invited === true || relation.joined === true) &&
        edit.newRelation.invited === false &&
        edit.newRelation.joined === false
      ) {
        rep.data = true;
      }

      // [5] A user can't cancel invite even if not invited (to clean boolean)
      if (
        !('isChanOp' in edit.newRelation) &&
        !('isBanned' in edit.newRelation) &&
        relation.invited === false &&
        edit.newRelation.invited === false
      ) {
        rep.data = true;
      }

      rep.success = true;
    } catch (error) {
      rep.error = error;
      rep.success = false;
      rep.message = error.message;
    }

    return rep;
  }

  public async updateChannelUserRelation(relation: UserChannelRelation) {
    const rep: ReturnData = {
      success: false,
      message: '',
    };

    try {
      const { userId, channelId } = relation;

      await this.userChannelRelation
        .createQueryBuilder()
        .update(UserChannelRelation)
        .set({
          isBoss: relation.isBoss,
          isChanOp: relation.isChanOp,
          joined: relation.joined,
          invited: relation.invited,
          isBanned: relation.isBanned,
          muted: relation.muted,
        })
        .where('userId = :userId AND channelId = :channelId', {
          userId,
          channelId,
        })
        .execute();

      rep.success = true;
    } catch (e) {
      rep.message = e.message;
      rep.error = e;
    }
    return rep;
  }

  public async updateChannelUsers(channel: Channel, user: User) {
    await this.channelRepository
      .createQueryBuilder()
      .relation(Channel, 'users')
      .of(channel.id)
      .add(user);
  }

  public async getPrivatePongie(channelId: number, userId: number) {
    const channel = await this.getChannelUsers(channelId);

    if (!channel) return null;

    return channel.users.find((user) => user.id !== userId);
  }

  public async isUserInChannel(
    userId: number,
    channelId: number,
  ): Promise<boolean> {
    const relation = await this.userChannelRelation.findOne({
      where: {
        userId: userId,
        channelId: channelId,
        joined: true,
        isBanned: false,
      },
    });

    return relation ? true : false;
  }

  // [!] to be called within a try-catch block [+] a checker/ ameliorer ca
  public async editRelation(
    chanOpId: number,
    channelInfos: EditChannelRelationDto,
  ) {
    const rep: ReturnData = {
      success: false,
      message: '',
    };

    if (
      channelInfos.newRelation.joined === undefined &&
      channelInfos.newRelation.invited === undefined &&
      channelInfos.newRelation.isChanOp === undefined &&
      channelInfos.newRelation.isBoss === undefined &&
      channelInfos.newRelation.isBanned === undefined &&
      channelInfos.newRelation.muted === undefined
    )
      throw new Error('need at least one property to edit channel relation');

    const relation: UserChannelRelation =
      await this.userChannelRelation.findOne({
        where: {
          userId: channelInfos.userId,
          channelId: channelInfos.channelId,
        },
      });

    if (!relation)
      throw new Error("can't find the user or the channel requested");

    // [+] to extract
    if (channelInfos.newRelation.joined !== undefined) {
      relation.joined = channelInfos.newRelation.joined;
      rep.message += `\nchanOp[${chanOpId}]:put joined to ${channelInfos.newRelation.joined} of user[${channelInfos.userId}]`;
    }

    if (channelInfos.newRelation.isBoss !== undefined) {
      relation.isBoss = channelInfos.newRelation.isBoss;
      rep.message += `\nChannel Master[${chanOpId}]:put channel master to ${channelInfos.newRelation.isBoss} of user[${channelInfos.userId}]`;
    }

    if (channelInfos.newRelation.isChanOp !== undefined) {
      relation.isChanOp = channelInfos.newRelation.isChanOp;
      rep.message += `\nchanOp[${chanOpId}]:put isChanOp to ${channelInfos.newRelation.isChanOp} of user[${channelInfos.userId}]`;
    }

    if (channelInfos.newRelation.invited !== undefined) {
      relation.invited = channelInfos.newRelation.invited;
      rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.invited} of user[${channelInfos.userId}]`;
    }

    if (channelInfos.newRelation.isBanned !== undefined) {
      relation.isBanned = channelInfos.newRelation.isBanned;
      rep.message += `\nchanOp[${chanOpId}]:put invited to ${channelInfos.newRelation.isBanned} of user[${channelInfos.userId}]`;
    }

    if (channelInfos.newRelation.muted !== undefined) {
      relation.muted = channelInfos.newRelation.muted;
      rep.message += `\nchanOp[${chanOpId}]:put muted to ${channelInfos.newRelation.isBanned} of user[${channelInfos.userId}]`;
    }

    const repDatabase: ReturnData = await this.updateChannelUserRelation(
      relation,
    );
    if (!repDatabase.success)
      throw new Error(
        'Error occured while updating user channel relation in database : ' +
          repDatabase.message,
      );

    if (
      channelInfos.newRelation.muted !== undefined &&
      channelInfos.newRelation.muted === true
    ) {
      setTimeout(
        async () => {
          await this.unMute(channelInfos);
        },
        10 * 60 * 1000,
      );
    }

    rep.success = true;
    return rep;
  }

  private async unMute(channelInfos: EditChannelRelationDto) {
    try {
      const relation: UserChannelRelation =
        await this.userChannelRelation.findOne({
          where: {
            userId: channelInfos.userId,
            channelId: channelInfos.channelId,
          },
        });
      if (relation.muted) {
        relation.muted = false;

        const repDatabase: ReturnData = await this.updateChannelUserRelation(
          relation,
        );
        if (!repDatabase.success)
          throw new Error(
            'Error occured while updating user channel relation in database : ' +
              repDatabase.message,
          );

        // [+] notifier le retour ou forcer update ... hum ?
      }
    } catch (timeErr) {
      this.log(`unMute auto timer error : ${timeErr.message}`);
    }
  }

  public async forceJoinPrivateMsgChannel(
    senderId: number,
    channelId: number,
    connectedUsers: Map<Socket, string>,
  ): Promise<ReturnData> {
    const rep: ReturnData = {
      success: false,
      message: '',
    };

    try {
      // [0] get privateMsg Channel + deduce target id
      const channel = await this.getChannelById(channelId);
      if (!channel) throw new Error(`channel[${channelId}] not found`);
      else if (
        channel.type !== 'privateMsg' ||
        !channel.name ||
        channel.name === ''
      )
        throw new Error(`channel[${channelId}] is not a privateMsg channel`);

      // [1] check channel relation exists
      const otherId: number = this.getOtherIdFromPrivateMsg(
        senderId,
        channel.name,
      );

      const repRelation = await this.getOneChannelUserRelation(
        otherId,
        channelId,
      );

      // creer relation here [!] [!]
      if (!repRelation.success) {
        const other = await this.usersService.getUserById(otherId);

        if (!other) throw new Error('no user found');

        await this.usersService.updateUserChannels(other, channel);
        const relationUser = await this.userChannelRelation.findOne({
          where: { userId: otherId, channelId: channel.id },
          relations: ['user', 'channel'],
        });

        if (!relationUser) throw new Error('cannot create relation');

        repRelation.data = relationUser;
        repRelation.success = true;
      }

      // [2] update receiver joined relation to true if needed
      if (
        repRelation.success &&
        repRelation.data &&
        repRelation.data.joined === false
      ) {
        repRelation.data.joined = true;

        const repDatabase: ReturnData = await this.updateChannelUserRelation(
          repRelation.data,
        );
        if (!repDatabase.success)
          throw new Error(
            'Error occured while updating user channel relation in database : ' +
              repDatabase.message,
          );
        else {
          // [3] emit an editRelation to receiver (if offline np ?)
          const sockets: Socket[] = [];
          for (const [socket, value] of connectedUsers) {
            if (value === otherId.toString()) sockets.push(socket);
          }

          sockets.forEach((socket) => {
            this.log(
              `forceJoinPrivateMsgChannel emit empty editRelation to user[${otherId}]->socket[${socket.id}]`,
            );
            socket.emit('editRelation', {});
            socket.join('channel:' + channelId);
          });
        }
      }

      rep.success = true;
    } catch (error: any) {
      rep.error = error;
      rep.message = error.message;
    }

    return rep;
  }

  public async editChannelPassword(
    senderId: number,
    channelId: number,
    password: string,
  ): Promise<ReturnData & { isProtected: boolean }> {
    const rep: ReturnData & { isProtected: boolean } = {
      success: false,
      message: '',
      isProtected: false,
    };

    try {
      // [0] get Channel +  users relation to check channel master rights
      const channel = await this.getChannelById(channelId);
      if (!channel) throw new Error(`channel[${channelId}] not found`);
      else if (channel.type === 'privateMsg')
        throw new Error(`channel[${channelId}] is a privateMsg channel`);

      const repRelation = await this.getOneChannelUserRelation(
        senderId,
        channelId,
      );

      if (!repRelation)
        throw new Error(
          `relation not found channel[${channelId}] user[${senderId}]`,
        );
      else if (!repRelation.data.isBoss)
        throw new Error(`user[${senderId}] is not channel master`);
      else if (password === '' && channel.type === 'protected')
        throw new Error("A protected channel can't have an empty password");

      this.channelRepository.update(channelId, {
        password: password,
      });

      rep.isProtected = channel.type === 'protected';
      rep.success = true;
    } catch (error: any) {
      rep.error = error;
      rep.message = error.message;
    }

    return rep;
  }

  public async verifyChannelPassword(
    senderId: number,
    channelId: number,
    password: string,
  ): Promise<ReturnData> {
    const rep: ReturnData = {
      success: false,
      message: '',
    };

    try {
      const channel = await this.getChannelById(channelId);
      if (!channel) throw new Error(`channel[${channelId}] not found`);
      else if (channel.type !== 'protected')
        throw new Error(
          `channel[${channelId}] is a ${channel.type} channel, no password can be asked`,
        );

      const repRelation = await this.getOneChannelUserRelation(
        senderId,
        channelId,
      );
      if (!repRelation)
        // [+] continuer => si pas de relation la créer
        throw new Error(
          `relation not found channel[${channelId}] user[${senderId}]`,
        );
      else if (repRelation.data.isBoss) {
        rep.success = true;
        return rep;
      } else if (repRelation.data.isBanned)
        throw new Error(`You are banned from this channel`);
      else if (password === '' && channel.type === 'protected')
        throw new Error("A protected channel can't have an empty password");

      rep.success = channel.password === password;
      if (!rep.success) throw new Error('Wrong password');
      else {
        try {
          repRelation.data.invited = false;
          repRelation.data.joined = true;
          const repEdit = await this.updateChannelUserRelation(
            repRelation.data,
          );
          if (!repEdit.success)
            throw new Error('Error with database, try later please');
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      rep.error = error;
      rep.message = error.message;
    }

    return rep;
  }

  public async editChannelType(
    senderId: number,
    channelId: number,
    type: ChannelType,
  ): Promise<ReturnData & { password: string }> {
    const rep: ReturnData & { password: string } = {
      success: false,
      message: '',
      password: '',
    };

    try {
      // [0] get Channel +  users relation to check channel master rights
      const channel = await this.getChannelById(channelId);
      if (!channel) throw new Error(`channel[${channelId}] not found`);
      else if (channel.type === 'privateMsg')
        throw new Error(`channel[${channelId}] is a privateMsg channel`);

      const repRelation = await this.getOneChannelUserRelation(
        senderId,
        channelId,
      );

      if (!repRelation)
        throw new Error(
          `relation not found channel[${channelId}] user[${senderId}]`,
        );
      else if (!repRelation.data.isBoss)
        throw new Error(`user[${senderId}] is not channel master`);

      this.channelRepository.update(channelId, {
        type: type,
      });

      rep.password = channel.password;
      rep.success = true;
    } catch (error: any) {
      rep.error = error;
      rep.message = error.message;
    }

    return rep;
  }

  // Container of connected users : Map<socket, user id>
  public async sendUpdateChannelnotif(
    channelId: number,
    connectedUsers: Map<Socket, string>,
    server: Server,
  ) {
    try {
      const channel = await this.getChannelUsers(channelId);

      const sockets: Socket[] = [];
      const userIds: number[] = [];

      channel.users.forEach((user) => {
        userIds.push(user.id);
      });

      connectedUsers.forEach((idString, socket) => {
        if (userIds.find((id) => (id === parseInt(idString)) !== undefined)) {
          sockets.push(socket);
        }
      });

      sockets.forEach((socket) => {
        this.log(
          `sendUpdateChannelnotif emit empty editRelation to user[${connectedUsers.get(
            socket,
          )}]->socket[${socket.id}]`,
        );
        server.to(socket.id).emit('editRelation', {});
      });
    } catch (e) {
      this.log(`sendUpdateChannelnotif error : ${e.message}`);
    }
  }

  // ------------------- PRIVATE ---------------------------------- //

  // [!][+] Doublon avec la version public : getOneChannelUserRelation
  private async privateGetOneChannelUserRelation(
    userId: number,
    channelId: number,
  ): Promise<UserChannelRelation> {
    return (await this.getChannelUsersRelations(userId, channelId)).usersRelation.find(
      (relation) => relation.userId === userId,
    );
  }

  // [+] a affinner avec l'evolution des types de channel, banlist guestlist etc.
  private verifyPermissions(
    userId: number,
    channelId: number,
    relation: UserChannelRelation,
  ) {
    if (!relation)
      throw new Error(
        `channel(id: ${channelId}) has no relation with user(id: ${userId})`,
      );
    else if (relation.isBoss === true) return;
    else if (relation.isBanned)
      throw new Error(
        `channel(id: ${channelId}) user(id: ${userId}) is banned`,
      );
    else if (!relation.isChanOp && !relation.isBoss)
      throw new Error(
        `channel(id: ${channelId}) user(id: ${userId}) channel operator privileges required`,
      );
  }

  private getOtherIdFromPrivateMsg(
    senderId: number,
    channelName: string,
  ): number {
    const tuple: {
      id1: number;
      id2: number;
    } = this.getIdsFromPrivateMsgChannelName(channelName);

    return senderId === tuple.id1 ? tuple.id2 : tuple.id1;
  }

  private getIdsFromPrivateMsgChannelName(channelName: string): {
    id1: number;
    id2: number;
  } {
    const tuple: string[] = channelName.split(' ');

    if (tuple.length !== 2)
      return {
        id1: -1,
        id2: -1,
      };

    return {
      id1: parseInt(tuple[0]),
      id2: parseInt(tuple[1]),
    };
  }

  // tools

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const cyan = '\x1b[36m';
    const stop = '\x1b[0m';

    process.stdout.write(cyan + '[channel service]  ' + stop);
    console.log(message);
  }

  async saveLastMessage(channelId: number, message: Message) {
    await this.channelRepository
      .createQueryBuilder()
      .relation(Channel, 'lastMessage')
      .of(channelId)
      .set(message);
  }
}
