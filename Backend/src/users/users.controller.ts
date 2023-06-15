import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';
import 'src/utils/extensions/stringExtension'


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  getUserProfile(@Request() req) {
    const user = this.usersService.getUserById(req.user.id);

    if (!user)
      throw new NotFoundException();
    
    return user;
  }

  @Get('profile/:login')
  getUserByLogin(@Param('login') login: string) {
    const user = this.usersService.getUserByLogin(login);

    if (!user)
      throw new NotFoundException();
    
    return user;
  }

  @Public()
  @Get('email')
  async checkDoubleEmail(@Query("email") email: string, res: Response) {
    const decodeUrl = decodeURIComponent(email);
    const user = await this.usersService.getUserByEmail(decodeUrl, "email");

    if (user)
      return {
        exists: true,
      };
    return {
      exists: false,
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

	user.motto = motto.filterBadWords();

	await this.usersService.updateUser(user);

  // cets moi qui ai changé ca (baptiste),
  // la fonction updateUser retourne pas d'erreur
  // juste elle update, mais je sais pas comment le checker encore
  // mais ce quon faisait prenait du temps pour rien
  // (de retourner le user a chaque fois)

	// if (!updatedUser || updatedUser.motto != motto) {
		// throw new BadRequestException('issue while updating motto');
		// return {
		// 	"exists": false,
		// };
	// }

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

	user.story = story.filterBadWords();

	console.log("Story recup :", story);
	await this.usersService.updateUser(user);

	// if (!updatedUser || updatedUser.story != story) {
		// throw new BadRequestException('issue while updating story');
		// return {
		// 	"exists": false,
		// };
	// }

	return {
		'message': 'story updated successfully '
	}
  }


}
