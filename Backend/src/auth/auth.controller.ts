import { Param, Controller, Get, Post, Body, UseGuards, Req, Res, Request, BadRequestException, Head } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { AvatarDto } from 'src/avatar/dto/Avatar.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Public()
	@Get('42/:code')
	async logIn42(@Param('code') code: string) {
		const	dataToken = await this.authService.getToken42(code);
		console.log("here", dataToken);
		if (!dataToken)
			return null;
		
		const	user42logged = await this.authService.logUser(dataToken);
		
		return this.authService.login(user42logged);
	}

	@Public()
	@Post('register')
	async registerUser(@Body() createUserDto: createUserDto) {
		const	user = await this.authService.addUser(createUserDto);

		if (!user)
			throw new BadRequestException();
		
		return {
			"message": "ok",
		}
	}

	@Public()
	@Get('verifyCode/:code')
	async verifyCode(@Param('code') code: string) {
		const	user = await this.authService.verifyCode(code);

		if (!user)
			return ({ "message": "This code does not exist. Please try again!" });
		
		if (user && user.expirationCode < Date.now()) {
			await this.authService.sendNewCode(user);
			return ({ "message": "This code has expired. A new one has been sent to your email address" });
		}

		user.verified = true;
		await this.authService.updateUser(user);

		const	{access_token} = await this.authService.login(user);
		return ({
			"message": "Loading...",
			"token": access_token,
		});
	}

	@Public()
	@UseGuards(GoogleOauthGuard)
	@Get('google')
	async googleAuth() {}

	@Public()
	@UseGuards(GoogleOauthGuard)
	@Get('google/callback')
	async googleOauthCallback(@Req() req, @Res() res: Response) {
		const	{access_token} = await this.authService.loginWithGoogle(req.user);
		res.cookie("crunchy-token", access_token);
		return res.redirect('http://localhost:3000/home');
	}

	@Post('firstLogin')
	async firstLogin(
		@Request() req,
		@Body('login') login: string,
		@Body('avatarChosen') avatar: AvatarDto
	) {
		
		try {
			const	user = await this.authService.updateUserLogin(req.user.id, login);
			avatar.userId = req.user.id;
			await this.authService.updateAvatar(avatar);
		
			const {access_token} = await this.authService.login(user);
		
			return {
				error: false,
				access_token,
			};
		} catch (err) {
			console.log(err.message);
			return {
				error: true,
				message: err.message,
			}
		}
	}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	loginEmail(@Request() req) {
		console.log(req.user);
		return this.authService.login(req.user);
	}
}
