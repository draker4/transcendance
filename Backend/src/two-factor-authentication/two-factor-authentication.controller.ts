/* eslint-disable prettier/prettier */
import { BadGatewayException, Controller, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { UsersService } from '@/users/users.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {

	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly usersService: UsersService,
	) {}

	@Post('generate')
	async register(@Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);

			if (!user)
				throw new Error('no user found');
			
			return await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
		}
		catch (error) {
			throw new BadGatewayException(error.message);
		}
	}

	@Post('sendCode')
	async sendCode(@Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);
		
			if (!user)
				throw new Error('no user found');

			this.twoFactorAuthenticationService.sendMail(user);
		}
		catch (error) {
			console.log(error.message);
			throw new BadGatewayException();
		}
	}

	@Post('verifyCode/:code')
	async verifyCode(@Param('code') code: string, @Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);

			if (!user)
				throw new Error('no user found');
			
			if (user.verifyCode !== code) {
				this.twoFactorAuthenticationService.sendMail(user);
				return {
					success: false,
					error: 'wrong code',
				}
			}
			
			if (user.expirationCode < Date.now()) {
				this.twoFactorAuthenticationService.sendMail(user);
				return {
					success: false,
					error: 'time out',
				}
			}

			return {
				success: true,
			}
		}
		catch (error) {
			console.log(error.message);
			throw new BadGatewayException();
		}
	}

	@Post('activate/:code')
	async activate(@Param('code') code: string, @Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);

			if (!user)
				throw new Error('no user found');
			
			const	isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				code, user
			);

			if (!isCodeValid)
				return {
					success: false,
					error: "wrong code",
				}
			
			this.usersService.updateUser(user.id, {
				isTwoFactorAuthenticationEnabled: true,
			});

			return {
				success: true,
			}
		}
		catch (error) {
			console.log(error.message);
			throw new BadGatewayException();
		}
	}

	@Post('deactivate/:code')
	async deactivate(@Param('code') code: string, @Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);

			if (!user)
				throw new Error('no user found');
			
			const	isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				code, user
			);

			if (!isCodeValid)
				return {
					success: false,
					error: "wrong code",
				}
			
			this.usersService.updateUser(user.id, {
				isTwoFactorAuthenticationEnabled: false,
			});

			return {
				success: true,
			}
		}
		catch (error) {
			console.log(error.message);
			throw new BadGatewayException();
		}
	}
}
