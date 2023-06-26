/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Repository } from 'typeorm';
import { AvatarDto } from './dto/Avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async createAvatar(avatarDto: AvatarDto) {
    return await this.avatarRepository.save(avatarDto);
  }

  async getAvatarById(userId: number): Promise<Avatar> {
    return await this.avatarRepository.findOne({ where: { userId: userId } });
  }

  async getAvatarByLogin(login: string): Promise<Avatar> {
    return await this.avatarRepository.findOne({ where: { login: login } });
  }

  async editColors(req: any, updateAvatarDto: UpdateAvatarDto) {
    const avatar: Avatar = await this.getAvatarById(req.user.id);

    // si on trouve pas d'avatar, on lui fourni un avatar par defaut
    if (!avatar) {
      const defaultAvatar = this.createDefaultAvatar(
        req.user.id,
        req.user.login,
      );

      const Data = {
        success: false,
        message: 'Avatar not found - default avatar created instead',
      };

      // si la creation par defaut a aussi echouee
      if (!defaultAvatar) {
        Data.message = 'Avatar not found, then failed default avatar creation';
      }

      return Data;
    }

    avatar.borderColor = updateAvatarDto.borderColor;
    avatar.backgroundColor = updateAvatarDto.backgroundColor;

    await this.avatarRepository.update(avatar.userId, avatar);

    const Data = {
      success: true,
      message: 'Avatar colors successfully updated',
    };

    return Data;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~ tools ~~~~~~~~~~~~~~~~~~~~~~ */

  //   private async isAvatarExists(id: number): Promise<boolean> {
  //     const avatar: Avatar = await this.avatarRepository.findOne({
  //       where: { userId: id },
  //     });
  //     return avatar ? true : false;
  //   }

  private async createDefaultAvatar(id: number, login: string) {
    const avatar: AvatarDto = {
      userId: id,
      login: login,
      image: '',
      text: '',
      variant: 'circular',
      borderColor: '#22d3ee',
      backgroundColor: '#22d3ee',
      empty: true,
    };

    return await this.avatarRepository.save(avatar);
  }
}
