import { Param, Controller, Get, Post, Body, NotFoundException, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Get('42/:code')
	async logIn42(@Param('code') code: string) {
		const	dataToken = await this.authService.getToken42(code);
		
		if (!dataToken)
			return null;
		
		const	user42logged = await this.authService.logUser(dataToken);
		
		return this.authService.login(user42logged);
	}

	@Post('register')
	async registerUser(@Body() createUserDto: createUserDto) {
		await this.authService.addUser(createUserDto);
	}

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

	@UseGuards(GoogleOauthGuard)
	@Get('google')
	async googleAuth() {}

	@UseGuards(GoogleOauthGuard)
	@Get('google/callback')
	async googleOauthCallback(@Req() req, @Res() res: Response) {
		const	{ access_token } = await this.authService.loginWithGoogle(req.user);
		res.cookie("crunchy-token", access_token);
		return res.redirect('http://localhost:3000/home');
	}
}

