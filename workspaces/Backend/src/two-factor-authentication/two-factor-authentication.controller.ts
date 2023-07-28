/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { BadGatewayException, BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { UsersService } from '@/users/users.service';
import { AuthService } from '@/auth/services/auth.service';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticationCode.dto';
import { VerifYCodeDto } from './dto/VerifYCode.dto';
import { BackupCodeDto } from './dto/BackupCode.dto';

@Controller('2fa')
export class TwoFactorAuthenticationController {

	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	@Get('generate')
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

	@Get('sendCode')
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

	@Post('verifyCode')
	async verifyCode(
		@Body() { code } : VerifYCodeDto,
		@Req() req) {
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

	@Post('activate')
	async activate(
		@Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto,
		@Req() req) {
		try {
			const	user = await this.usersService.getUserBackupCodes(req.user.id);

			if (!user)
				throw new Error('no user found');
			
			const	isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode, user
			);

			if (!isCodeValid)
				return {
					success: false,
					error: "wrong code",
				}
      
      this.twoFactorAuthenticationService.updateBackupCodes(user);
			
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

	@Post('deactivate')
	async deactivate(
		@Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto,
		@Req() req) {
		try {
			const	user = await this.usersService.getUserById(req.user.id);

      if (!user)
				throw new Error('no user found');
			
			const	isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode, user
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

	@Post('authenticate')
	@HttpCode(200)
	async authenticate(
		@Req() req,
		@Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	) {
		try {

			const	user = await this.usersService.getUserById(req.user.id);

			if (!user)
				throw new Error('no user found');

			const	isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode,
				user,
			);

			if (!isCodeValid)
				return {
					success: false,
					error: 'wrong code',
				}
			
			const {access_token, refresh_token} = await this.authService.login(user, 0, false);

			return {
				success: true,
				access_token,
				refresh_token,
			}
		}
		catch (error) {
      throw new BadRequestException();
		}
	}

  @Get('backupCodes')
  async backupCodes(@Req() req) {
    return this.twoFactorAuthenticationService.getBackupCodes(req.user.id);
  }

  @Post('verifyAuthCode')
  async verifyAuthCode(
    @Req() req,
		@Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto
	) {

    try {

      const user = await this.usersService.getUserById(req.user.id);

      if (!user)
        throw new Error('no user found');

      const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user,
      );

      if (!isCodeValid)
        return {
          success: false,
          error: 'wrong code',
        }
      
      return {
        success: true,
      }
    }
    catch (error) {
      console.log(error);
      throw new BadGatewayException();
    }
  }

  @Post('getAccountBack')
  async getAccountBack(
    @Req() req,
		@Body() { backupCode } : BackupCodeDto
	) {
    try {
      const user = await this.usersService.getUserBackupCodes(req.user.id);

      if (!user)
        throw new Error('no user found');
      
      const isCodeValid = await this.twoFactorAuthenticationService.isBackupCodeValid(
        backupCode,
        user,
      );

      if (!isCodeValid)
        return {
          success: false,
          error: 'no code',
        }

      this.usersService.updateUser(user.id, {
        isTwoFactorAuthenticationEnabled: false,
      });

      const { access_token, refresh_token } = await this.authService.login(
        user, 0, false
      );
      
      return {
        success: true,
        access_token,
        refresh_token,
      }

    }
    catch(error) {
      console.log(error.message);
      throw new BadGatewayException();
    }
  }

}
