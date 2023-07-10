/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/utils/decorators/public.decorator';
import 'src/utils/extensions/stringExtension';
import { EditUserDto } from './dto/EditUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUserProfile(@Request() req) {
    const user = this.usersService.getUserById(req.user.id);

    if (!user) throw new NotFoundException();

    return user;
  }

  // GET user + his dependency avatar
  @Get('myAvatar')
  getUserProfileWithAvatar(@Request() req) {
    const user = this.usersService.getUserAvatar(req.user.id);

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

  @Get('avatar/:id')
  async getUserWithAvatar(@Param('id') id: string) {
    id = decodeURIComponent(id);
    const user = await this.usersService.getUserAvatar(parseInt(id));

    console.log("=== userWithAvatar ===\n", user);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Public()
  @Get('email')
  async checkDoubleEmail(@Query('email') email: string) {
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
  async checkDoubleLogin(@Query('login') login: string) {
    const decodeUrl = decodeURIComponent(login);
    const user = await this.usersService.getUserByLogin(decodeUrl);

    if (user) return { exists: true };
    return { exists: false };
  }


  // [!] utiliser trycatch pour manip la database
  @Put()
  async editUser(@Request() req, @Body('properties') properties: EditUserDto) {
    console.log("User @Put called, properties = \n", properties);

    const updatedProperties = [];
    let message = "";

    for (const key in properties) {
      if (properties.hasOwnProperty(key) && properties[key] !== undefined) {
        updatedProperties.push(key);
      }
    }

    if (updatedProperties.length > 0) {
      message = `Properties : ${updatedProperties.join(', ')} : successfully updated`
    }

    return {
      message: message,
    }
  }

  // [!] utiliser un PUT + foutre en trycatch
  // faire ca de maniere générique
  @Post('edit-motto')
  async editMotto(@Request() req, @Body('submitedMotto') motto: string) {
    console.log('POST~edit-motto method called'); //checking
    const user = await this.usersService.getUserById(req.user.id);

    if (!user)
      throw new NotFoundException('User not found');
    
    // user.motto = motto.filterBadWords();
    // console.log(user);
    await this.usersService.updateUser(user.id, {
      motto: motto.filterBadWords(),
    });

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
    }

    // user.story = story.filterBadWords();

    // console.log('Story recup :', story);
    // await this.usersService.updateUser(user.id, user);
    await this.usersService.updateUser(user.id, {
      story: story.filterBadWords(),
    });
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
    const user1 = await this.usersService.getUserChannels(1);
    const user2 = await this.usersService.getUserChannels(2);
    const user3 = await this.usersService.getUserChannels(3);

    const channel1 = await this.usersService.getChannelByName("test1");
    const channel2 = await this.usersService.getChannelByName("test2");
    const channel3 = await this.usersService.getChannelByName("test3");

    await this.usersService.updateUserChannels(user1, channel1);
    await this.usersService.updateUserChannels(user1, channel2);
    await this.usersService.updateUserChannels(user1, channel3);
    await this.usersService.updateUserChannels(user2, channel1);
    await this.usersService.updateUserChannels(user2, channel2);
    await this.usersService.updateUserChannels(user2, channel3);
    await this.usersService.updateUserChannels(user3, channel1);
    await this.usersService.updateUserChannels(user3, channel2);
    await this.usersService.updateUserChannels(user3, channel3);
  }

  @Public()
  @Get('addPongie')
  async addPongie() {
    const user1 = await this.usersService.getUserPongies(1);
    const user2 = await this.usersService.getUserPongies(2);
    const user3 = await this.usersService.getUserPongies(3);

    await this.usersService.updateUserPongies(user1, user2);
    await this.usersService.updateUserPongies(user1, user3);
    await this.usersService.updateUserPongies(user2, user1);
    await this.usersService.updateUserPongies(user2, user3);
    await this.usersService.updateUserPongies(user3, user1);
    await this.usersService.updateUserPongies(user3, user2);
  }
}
