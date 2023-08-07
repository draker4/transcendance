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

  // [+] Un guard verifiant que l'user est chanOp ? (verifie si il est dans la channel aussi avant)
  @Put('editRelation')
  async editRelation(
    @Request() req,
    @Body() newRelation: EditChannelRelationDto,
  ) {
    let rep: ReturnData = {
      success: false,
      message: '',
    };
    try {
      const check = await this.channelService.checkChanOpPrivilege(
        req.user.id,
        newRelation.channelId,
      );
      if (!check.isChanOp) throw new Error(check.error);
      rep = await this.channelService.editRelation(req.user.id, newRelation);
    } catch (error) {
      rep.success = false;
      rep.message = error.message;
    }

    return rep;
  }
}
