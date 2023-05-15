import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
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

@Controller('api/users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add')
  @UsePipes(ValidationPipe)
  async addUser(
    @Body() createUserDto: createUserDto
  ) {
    const result = await this.usersService.addUser(createUserDto);
    return result;
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
