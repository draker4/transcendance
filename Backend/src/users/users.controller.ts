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

  @Post('edit')
  async editProfile(@Request() req, @Body('submittedMotto') motto: string) {

	// throw new NotFoundException('User not found');
	const user = await this.usersService.getUserById(req.user.id);

	if (!user) {
		throw new NotFoundException('User not found');
		// return {
		// 	"exists": false,
		// };
	}
	user.motto = motto;
	const updatedUser = await this.usersService.updateUser(user);

	if (!updatedUser || updatedUser.motto != motto) {
		throw new BadRequestException('issue while updating motto');
		// return {
		// 	"exists": false,
		// };
	}

	return {
		'message': 'motto updated successfully'
	}
  }
}
