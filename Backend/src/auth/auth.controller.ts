import { Param, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Get('42/:code')
	// @UseGuards(logIn42Guard)
	async logIn42(@Param('code') code: string) {

		const	dataToken = await this.authService.getToken42(code);

		if (!dataToken)
			return null;

		const	user42logged = await this.authService.logUser(dataToken);
		return user42logged;
	}
}

