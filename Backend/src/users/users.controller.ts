import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/CreateUser.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('add')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  async addUser(
    @Body() createUserDto: createUserDto
  ) {
    const result = await this.usersService.addUser(createUserDto);
    return result;
  }

  @Get('getall')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
