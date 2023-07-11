/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "src/utils/decorators/public.decorator";
import { ChannelService } from "./channel.service";

@Controller('channel')
export class ChannelController {

	constructor(private readonly channelService: ChannelService) {}

	@Public()
	@Get(':channel')
	test(@Param('channel') channelName: string) {
		this.channelService.addChannel(channelName, "public");
	}
}
