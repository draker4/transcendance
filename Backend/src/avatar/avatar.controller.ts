import { Controller, Get, NotFoundException, Param, Request } from '@nestjs/common';
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


	@Get(':login')
	async getAvatarByLogin(@Param('login') login:string) {
		const	avatar = await this.avatarService.getAvatarByLogin(login);

		if (!avatar)
			throw new NotFoundException('avatar not found');
		
		return avatar;
	}

}
