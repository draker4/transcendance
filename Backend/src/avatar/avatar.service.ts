import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarDto } from 'src/users/dto/Avatar.dto';
import { Avatar } from 'src/utils/typeorm/Avatar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AvatarService {
	constructor(
		@InjectRepository(Avatar)
		private readonly avatarRepository: Repository<Avatar>,
  	) {}

	async updateAvatar(avatarDto: AvatarDto) {
		const	avatar: Avatar = await this.avatarRepository.findOne({ where: { userId: avatarDto.userId } });

		if (avatar) {
			await this.avatarRepository.update(avatar.userId, avatar);
			return avatar;
		}
		
		return await this.avatarRepository.save(avatarDto);
	}

	async getAvatarById(userId: number) {
		return	await this.avatarRepository.findOne({ where: { userId: userId } });
	}
}
