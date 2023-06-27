import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get()
  async getAvatar(@Request() req) {
    const avatar = await this.avatarService.getAvatarById(req.user.id);

    if (!avatar)
      return {
        exists: false,
      };

    return avatar;
  }

  @Get(':login')
  async getAvatarByLogin(@Param('login') login: string) {
    const avatar = await this.avatarService.getAvatarByLogin(login);

    if (!avatar) throw new NotFoundException('avatar not found');

    return avatar;
  }

  @Put()
  async updateAvatar(
    @Request() req,
    @Body(new ValidationPipe()) updateAvatarDto: UpdateAvatarDto,
  ) {
    // [!] TODO : custom validationPipe OU enumeDecorator contenant le tableau des couleurs authorisee
    // [!] ne pas oublier que les couleurs peuvent avoir des min et/ou majuscules
    console.log('PUT avatar received');
    console.log('updateAvatarDto :', updateAvatarDto);

    return this.avatarService.editColors(req, updateAvatarDto);
  }
}
