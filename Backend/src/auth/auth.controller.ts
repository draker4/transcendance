import { Param, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Public()
	@Get('42/:code')
	async logIn42(@Param('code') code: string) {
		const	dataToken = await this.authService.getToken42(code);

		if (!dataToken)
			return null;

		const	user42logged = await this.authService.logUser(dataToken);
		
		return this.authService.login(user42logged);
	}
}

