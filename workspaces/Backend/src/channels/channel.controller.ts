/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, Request } from "@nestjs/common";
import { ChannelService } from "./channel.service";

@Controller('channel')
export class ChannelController {

	constructor(
		private readonly channelService: ChannelService
	) {}

	// [+] l'user req.user.id => filtrer les infos en fonction des boolean de la Relation
	// > a accorder avec avatarService.editChannelAvatarColors(), mm principe
	@Get(':id')
	async getChannelById(@Request() req, @Param('id', ParseIntPipe) id: number) {
		// console.log("[channel controller] Get channel of id :" + id); // checking
		const data = await this.channelService.getChannelUsersRelations(id);
		
		// console.log("[channel controller] data :", data); // checking

		return data;
	}
}
