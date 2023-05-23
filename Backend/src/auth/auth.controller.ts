import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Get('42/:code')
	// @UseGuards(logIn42Guard)
	async logIn42(@Param('code') code: string): Promise<Partial<createUserDto>> {

		const	dataToken = await this.authService.getToken42(code);

		if (!dataToken)
			return null;

		const	user42logged = await this.authService.logUser(dataToken);

		console.log(user42logged);
		return user42logged;
	}
}

