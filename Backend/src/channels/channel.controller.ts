/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, Request } from "@nestjs/common";
import { ChannelService } from "./channel.service";

@Controller('channel')
export class ChannelController {

	constructor(
		private readonly channelService: ChannelService
	) {}

	// [+] l'user req.user.id, filtrer les infos en fonction status ? 
	@Get(':id')
	async getChannelById(@Request() req, @Param('id', ParseIntPipe) id: number) {
		console.log("[channel service] Get channel of id :" + id);
		const data = this.channelService.getChannelUsersRelations(id);
		
		console.log("[channel service] data :" + data);

		return data;
	}
}
