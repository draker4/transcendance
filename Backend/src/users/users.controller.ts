import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService, UserService } from './users.service';
import { createUserDto } from './dto/CreateUser.dto';

// @Controller('users')
// export class UsersController {

// 	constructor(private readonly usersService: UsersService) {};	

// 	@Get()
// 	findAll() {
// 		console.log('get route');
// 		return this.usersService.findAll();
// 	}

// 	@Post()
// 	@UsePipes(ValidationPipe)
// 	addUser(@Body() createUserDto: createUserDto) {
// 		console.log('post route');
// 		return this.usersService.addUser(createUserDto);
// 	}
// }

@Controller('/api/adduser')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const result = await this.userService.addUser(username, password);
    return result;
  }
}

@Controller('/api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }
}