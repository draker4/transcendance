import { BadRequestException, Body, Controller, Get, HttpException, NotFoundException, Post, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getUserProfile(@Request() req) {
    return this.usersService.getUserById(req.user.id);
  }

  @Public()
  @Get('email')
  async checkDoubleEmail(@Query("email") email: string, res: Response) {
    const decodeUrl = decodeURIComponent(email);
    const user = await this.usersService.getUserByEmail(decodeUrl);

    if (user)
      return { 
        exists: true,
        provider: user.provider,
      };
    return {
      exists: false,
      provider: "",
    };
  }

  @Public()
  @Get('login')
  async checkDoubleLogin(@Query("login") login: string, res: Response) {
    const decodeUrl = decodeURIComponent(login);
    const user = await this.usersService.getUserByLogin(decodeUrl);

    if (user)
      return { exists: true };
    return { exists: false };
  }

  @Post('edit-motto')
  async editMotto(@Request() req, @Body('submitedMotto') motto: string) {

	const user = await this.usersService.getUserById(req.user.id);

	if (!user) {
		throw new NotFoundException('User not found');
		// return {
		// 	"exists": false,
		// };
	}
	user.motto = motto;
	console.log("Motto recup :", motto);
	const updatedUser = await this.usersService.updateUser(user);

	if (!updatedUser || updatedUser.motto != motto) {
		throw new BadRequestException('issue while updating motto');
		// return {
		// 	"exists": false,
		// };
	}

	return {
		'message': 'motto updated successfully '
	}
  }

  @Post('edit-story')
  async editStory(@Request() req, @Body('submitedStory') story: string) {

	const user = await this.usersService.getUserById(req.user.id);

	if (!user) {
		throw new NotFoundException('User not found');
		// return {
		// 	"exists": false,
		// };
	}
	user.story = story;
	console.log("Story recup :", story);
	const updatedUser = await this.usersService.updateUser(user);

	if (!updatedUser || updatedUser.story != story) {
		throw new BadRequestException('issue while updating story');
		// return {
		// 	"exists": false,
		// };
	}

	return {
		'message': 'story updated successfully '
	}
  }


}
