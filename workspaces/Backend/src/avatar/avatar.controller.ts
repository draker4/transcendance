/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Put,
  Request,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UsersService } from 'src/users/users.service';

@Controller('avatar')
export class AvatarController {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAvatar(@Request() req) {
    const user = await this.userService.getUserAvatar(req.user.id);

    if (!user)
      return {
        exists: false,
      };

    console.log("[!] EST CE QU'ON UTILISE CE ENDPOINT ?");
    // je crois pas on peut supprimer je pense - Baptiste

    return user.avatar;
  }

  @Get(':id/:isChannel')
  async getAvatarById(
    @Param('id', ParseIntPipe) id: number,
    @Param('isChannel', ParseBoolPipe) isChannel: boolean,
  ) {
    return await this.avatarService.getAvatarById(id, isChannel);
  }

  @Put()
  async updateUserAvatar(
    @Request() req,
    @Body() updateUserAvatarDto: UpdateUserAvatarDto,
  ) {
    return updateUserAvatarDto.isChannel > 0
      ? this.avatarService.editChannelAvatarColors(req, updateUserAvatarDto)
      : this.avatarService.editUserAvatarColors(req, updateUserAvatarDto);
  }
}
