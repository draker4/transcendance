/* eslint-disable prettier/prettier */
import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
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

  // [!] secu + dto
  @Get('profile/:id')
  async getUserByLogin(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Get('avatar/:id')
  async getUserWithAvatar(@Param('id') id: string) {
    id = decodeURIComponent(id);
    const user = await this.usersService.getUserAvatar(parseInt(id));

    console.log("=== userWithAvatar ===\n", user);

    if (!user) throw new NotFoundException();

    // return user;
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

  @Get('login')
  async checkDoubleLogin(@Query('login') login: string) {
    try {
      const decodeUrl = decodeURIComponent(login);
      const user = await this.usersService.getUserByLogin(decodeUrl);

      if (user) return { exists: true };
      return { exists: false };
    }
    catch (error) {
      console.log(error.message);
      throw new BadGatewayException();
    }
  }

  @Put()
  async editUser(@Request() req, @Body('properties') properties: EditUserDto) {
	  return await this.usersService.editUser(req.user.id, properties);
  }

  // @Public()
  // @Get('join')
  // async joinChannel() {
  //   const user1 = await this.usersService.getUserChannels(1);
  //   const user2 = await this.usersService.getUserChannels(2);
  //   // const user3 = await this.usersService.getUserChannels(3);

  //   const channel1 = await this.usersService.getChannelByName("test1");
  //   // const channel2 = await this.usersService.getChannelByName("test2");
  //   // const channel3 = await this.usersService.getChannelByName("test3");

  //   await this.usersService.updateUserChannels(user1, channel1);
  //   // await this.usersService.updateUserChannels(user1, channel2);
  //   // await this.usersService.updateUserChannels(user1, channel3);
  //   await this.usersService.updateUserChannels(user2, channel1);
  //   // await this.usersService.updateUserChannels(user2, channel2);
  //   // await this.usersService.updateUserChannels(user2, channel3);
  //   // await this.usersService.updateUserChannels(user3, channel1);
  //   // await this.usersService.updateUserChannels(user3, channel2);
  //   // await this.usersService.updateUserChannels(user3, channel3);
  // }

  // @Public()
  // @Get('addPongie')
  // async addPongie() {
  //   const user1 = await this.usersService.getUserPongies(1);
  //   const user2 = await this.usersService.getUserPongies(2);
  //   // const user3 = await this.usersService.getUserPongies(3);

  //   await this.usersService.updateUserPongies(user1, user2);
  //   // await this.usersService.updateUserPongies(user1, user3);
  //   await this.usersService.updateUserPongies(user2, user1);
  //   // await this.usersService.updateUserPongies(user2, user3);
  //   // await this.usersService.updateUserPongies(user3, user1);
  //   // await this.usersService.updateUserPongies(user3, user2);
  // }

  @Public()
  @Delete('disconnect/:id')
  async deleteTokens(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.usersService.getUserTokens(id);

      if (user)
        return await this.usersService.deleteAllUserTokens(user);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  @Delete('disconnectByToken')
  async deleteTokensByAccessToken(@Req() req) {
    try {
      const user = await this.usersService.getUserTokens(req.user.id);

      if (user)
        return await this.usersService.deleteAllUserTokens(user);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  @Put('changeLogin')
  async changeLogin(
    @Req() req,
		@Body() { login } : EditUserDto,
  ) {
    try {
      const user = await this.usersService.getUserById(req.user.id);

      if (!user)
        throw new Error("no user found");

      const userWithLogin = await this.usersService.getUserByLogin(login);
      if (userWithLogin)
        return {
          success: false,
          error: 'exists',
        }
      
      this.usersService.updateUser(user.id, {
        login: login,
      });

      return {
        success: true
      }
      
    }
    catch (error) {
      console.log(error.message);
      throw new BadGatewayException();
    }
  }

  @Post('checkPassword')
  async checkPassword(
    @Req() req,
    @Body('password') password: string,
  ) {
    return await this.usersService.checkPassword(req.user.id, password);
  }

  @Put('updatePassword')
  async updatePassword(
    @Req() req,
    @Body('password') password: string,
  ) {
    return await this.usersService.updatePassword(req.user.id, password);
  }
}
