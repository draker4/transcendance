/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ChannelService } from 'src/channels/channel.service';
import { newMsgDto } from '../dto/newMsg.dto';

type Required = {
    channelId:number;
}

@Injectable()
export class ChannelAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly channelService: ChannelService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

//    console.log("--into ChannelGuard--"); // checking

    const req = context.switchToHttp().getRequest();
    const wsContext = context.switchToWs();
    const message:Required = wsContext.getData();

    const channelId = message.channelId;
    const userId = req.user.id;

//    console.log("channelId =", channelId); // checking
//    console.log("userId =", userId); // checking

    return this.channelService.isUserInChannel(userId, channelId);
  }
}