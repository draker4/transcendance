/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/Avatar.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async createAvatar(avatarDto: AvatarDto) {
    return await this.avatarRepository.save(avatarDto);
  }

  // async getAvatarById(userId: number): Promise<Avatar> {
  //   return await this.avatarRepository.findOne({ where: { userId: userId } });
  // }

  // async getAvatarByName(name: string, isChannel: boolean): Promise<Avatar> {
  //   return await this.avatarRepository.findOne({
  //     where: { name: name, isChannel: isChannel },
  //   });
  // }

  // async editUserAvatarColors(
  //   req: any,
  //   updateUserAvatarDto: UpdateUserAvatarDto,
  // ) {
  //   // [+] en faire un type si utilise souvent
  //   const rep = {
  //     success: false,
  //     message: '',
  //   };

  //   try {
  //     const avatar: Avatar = await this.getAvatarById(req.user.id, false);

  //     if (!avatar) {
  //       const defaultAvatar = this.createDefaultAvatar(req.user.login);
  //       rep.message = 'Avatar not found - default avatar created instead';

  //       if (!defaultAvatar)
  //         rep.message = 'Avatar not found, then failed default avatar creation';
  //     } else {
  //       avatar.borderColor = updateUserAvatarDto.borderColor;
  //       avatar.backgroundColor = updateUserAvatarDto.backgroundColor;
  //       await this.avatarRepository.update(avatar.id, avatar);

  //       this.log(
  //         `user : ${req.user.login} - border color updated: ${updateUserAvatarDto.borderColor} - background color updated: ${updateUserAvatarDto.backgroundColor}`,
  //       );
  //       rep.success = true;
  //       rep.message = 'Avatar colors successfully updated';
  //     }
  //   } catch (error) {
  //     rep.message = error.message;
  //   }
  //   return rep;
  // }

  /* ~~~~~~~~~~~~~~~~~~~~~~ tools ~~~~~~~~~~~~~~~~~~~~~~ */

  // private async createDefaultAvatar(name: string) {
  //   const avatar: AvatarDto = {
  //     image: '',
  //     text: '',
  //     variant: 'circular',
  //     borderColor: '#22d3ee',
  //     backgroundColor: '#22d3ee',
  //     empty: true,
  //     isChannel: false,
  //     decrypt: false,
  //   };

  //   return await this.avatarRepository.save(avatar);
  // }

  // [!][?] virer ce log pour version build ?
  private log(message?: any) {
    const cyan = '\x1b[36m';
    const stop = '\x1b[0m';

    process.stdout.write(cyan + '[Avatar service]  ' + stop);
    console.log(message);
  }
}
