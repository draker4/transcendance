import { Param, Controller, Get, Post, Body, ValidationPipe, UsePipes, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { createUserDto } from 'src/users/dto/CreateUser.dto';

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

	@Public()
	@Post('register')
	async registerUser(@Body() createUserDto: createUserDto) {
		await this.authService.addUser(createUserDto);
	}

	@Public()
	@Get('verifyCode/:code')
	async verifyCode(@Param('code') code: string) {
		const	user = await this.authService.verifyCode(code);

		if (!user)
			return ({ "message": "This code does not exist. Please try again!" });
		
		if (user && user.expirationCode < Date.now()) {
			const	newUser = await this.authService.sendNewCode(user);
			if (newUser)
				return ({ "message": "This code has expired. A new one has been sent to your email address" });
			throw new NotFoundException();
		}

		user.verified = true;
		const	{ access_token } = await this.authService.login(user);
		return ({
			"message": "Loading...",
			"token": access_token,
		});
	}
}

