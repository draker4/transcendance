/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { EditChannelRelationDto } from './dto/EditChannelRelation.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // [+] l'user req.user.id => filtrer les infos en fonction des boolean de la Relation
  // > a accorder avec avatarService.editChannelAvatarColors(), mm principe
  @Get(':id')
  async getChannelById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    try {
      return await this.channelService.getChannelUsersRelations(id);
    }
    catch (error) {
      throw new BadRequestException();
    }
  }

  @Put('editRelation')
  async editRelation(
    @Request() req,
    @Body() edit: EditChannelRelationDto,
  ) {
    let rep: ReturnData = {
      success: false,
      message: '',
    };

    let isSpecialCase:boolean;

    try {

      if (req.user.id === edit.userId) {
        isSpecialCase = await this.channelService.checkEditRelationSpecialCase(
          req.user.id,
          edit
        );
      } else
        isSpecialCase = false;

      const check = await this.channelService.checkChanOpPrivilege(
        req.user.id,
        edit.channelId
      );

      if (!isSpecialCase && !check.isOk) throw new Error(check.error);

      rep = await this.channelService.editRelation(req.user.id, edit);

    } catch (error) {
      rep.success = false;
      rep.message = error.message;
    }

    return rep;
  }
}
