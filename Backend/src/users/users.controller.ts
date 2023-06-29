/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { Public } from 'src/utils/decorators/public.decorator';
import 'src/utils/extensions/stringExtension';
import { Channel } from 'src/utils/typeorm/Channel.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUserProfile(@Request() req) {
    const user = this.usersService.getUserById(req.user.id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Get('profile/:login')
  async getUserByLogin(@Param('login') login: string) {
    login = decodeURIComponent(login);
    const user = await this.usersService.getUserByLogin(login);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Public()
  @Get('email')
  async checkDoubleEmail(@Query('email') email: string, res: Response) {
    const decodeUrl = decodeURIComponent(email);
    const user = await this.usersService.getUserByEmail(decodeUrl, 'email');

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
  async checkDoubleLogin(@Query('login') login: string, res: Response) {
    const decodeUrl = decodeURIComponent(login);
    const user = await this.usersService.getUserByLogin(decodeUrl);

    if (user) return { exists: true };
    return { exists: false };
  }

  @Post('edit-motto')
  async editMotto(@Request() req, @Body('submitedMotto') motto: string) {
    console.log('POST~edit-motto method called'); //checking
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
      message: 'motto updated successfully ',
    };
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

    console.log('Story recup :', story);
    await this.usersService.updateUser(user);

    // if (!updatedUser || updatedUser.story != story) {
    // throw new BadRequestException('issue while updating story');
    // return {
    // 	"exists": false,
    // };
    // }

    return {
      message: 'story updated successfully ',
    };
  }

  @Public()
  @Get('join')
  async joinChannel() {
    const user1 = await this.usersService.getUserById(1);
    // const user2 = await this.usersService.getUserById(2);

    const channel = await this.usersService.getChannelByName("test");

    user1.channels.push(channel);
    // user2.channels.push(channel);

    await this.usersService.saveUser(user1);
    // await this.usersService.saveUser(user2);
  }

  // @Public()
  // @Get('channels/:id')
  // async getChannels(@Param('id') id: number) {
  //   const user = await this.usersService.getUserById(id);

  //   console.log(user.channels);
  // }

  // @Public()
  // @Get('channels/:name')
  // async getChannels(@Param('name') name: string) {
  //   const channel = await this.usersService.getChannelByName(name);

  //   console.log(channel.users);
  // }

  // @Public()
  // @Get('test')
  // async addPongie() {
  //     const user1 = await this.usersService.getUserById(1);
  //     const user2 = await this.usersService.getUserById(2);

  //     if (!user1.pongies)
  //       user1.pongies = [];
  
  //     if (!user2.pongies)
  //       user2.pongies = [];
  
  //     user1.pongies.push(user2);
  //     user2.pongies.push(user1);
  
  //     await this.usersService.saveUser(user1);
  //     await this.usersService.saveUser(user2);
  // }
}
