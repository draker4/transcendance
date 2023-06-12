import { Controller, Get, Request } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('avatar')
export class AvatarController {
	
	constructor(private readonly avatarService: AvatarService) {}

	@Get()
	async getAvatar(@Request() req) {
		const	avatar = await this.avatarService.getAvatarById(req.user.id);

		if (!avatar)
			return {
				exists: false,
			}
		
		return avatar;
	}

}
