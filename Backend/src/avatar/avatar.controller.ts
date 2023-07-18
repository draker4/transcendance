/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseBoolPipe,
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

	console.log("[!] UTILISE ?????");

    return user.avatar;
  }



  // [!][+] Dto  + finir lorsquon veut avatar de channel
  @Get(':id/:isChannel')
  async getAvatarByUserId(
    @Param('id') id: number,
    @Param('isChannel', ParseBoolPipe) isChannel: boolean,
  ) {

	if (!isChannel) {
    	const avatar = (await this.userService.getUserAvatar(id)).avatar;

    if (!avatar) throw new NotFoundException('avatar not found');

    return avatar;

	}

	// [+] continuer pour version isavatar === true
	return "";
		
  }

  @Put()
  async updateUserAvatar(@Request() req, @Body() updateUserAvatarDto: UpdateUserAvatarDto) {
    return this.avatarService.editUserAvatarColors(req, updateUserAvatarDto);
  }
}
