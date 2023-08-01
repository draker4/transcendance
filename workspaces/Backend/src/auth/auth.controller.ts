/* eslint-disable prettier/prettier */
import {
  Param,
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Request,
  BadRequestException,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Public } from 'src/utils/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { AvatarDto } from 'src/avatar/dto/Avatar.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtNoExpirationGuard } from './guards/jwtNoExpiration.guard';
import { AuthService } from './services/auth.service';
import { HttpExceptionFilter } from '@/utils/filter/http-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('42')
  async logIn42(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    try {
      if (!code)
        throw new Error('no code');
          
      const dataToken = await this.authService.getToken42(code);
      if (!dataToken)
        throw new Error('no 42 token');

      const user42logged = await this.authService.logUser(dataToken);
      if (!user42logged)
        throw new Error('no 42 user');

      const { access_token, refresh_token } = await this.authService.login(
        user42logged,
        0,
        user42logged.isTwoFactorAuthenticationEnabled,
      );

      res.cookie('crunchy-token', access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      res.cookie('refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      return res.redirect(`http://${process.env.HOST_IP}:3000/home/auth/connect`);
    }
    catch (error) {
      console.log(error);
      return res.redirect(`http://${process.env.HOST_IP}:3000/welcome/login/wrong`);
    }
    // return this.authService.login(
    //   user42logged,
    //   0,
    //   user42logged.isTwoFactorAuthenticationEnabled,
    // );
  }

  @Public()
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.addUser(createUserDto);
      if (!user) throw new BadRequestException();

      return {
        message: 'ok',
      };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Public()
  @Get('verifyCode/:code')
  async verifyCode(@Param('code') code: string) {
    try {
      const user = await this.authService.verifyCode(code);

      if (!user)
        return { message: 'This code does not exist. Please try again!' };

      if (user && user.expirationCode < Date.now()) {
        await this.authService.sendNewCode(user);
        return {
          message:
            'This code has expired. A new one has been sent to your email address',
        };
      }

      await this.authService.updateUser(user.id, {
        verified: true,
      });

      const { access_token, refresh_token } = await this.authService.login(
        user,
        0,
        user.isTwoFactorAuthenticationEnabled,
      );
      return {
        message: 'Loading...',
        access_token,
        refresh_token,
      };
    } catch (error) {
      return {
        message: 'Something went wrong, please try again !',
      };
    }
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @UseFilters(HttpExceptionFilter)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleOauthGuard)
  @UseFilters(HttpExceptionFilter)
  @Get('google/callback')
  async googleOauthCallback(@Req() req, @Res() res: Response) {
    try {
      const user = await this.authService.loginWithGoogle(req.user);

      const { access_token, refresh_token } = await this.authService.login(
        user,
        0,
        user.isTwoFactorAuthenticationEnabled,
      );

      res.cookie('crunchy-token', access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      res.cookie('refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      return res.redirect(`http://${process.env.HOST_IP}:3000/home/auth/connect`);
    // return res.redirect(`http://${process.env.HOST_IP}:3000/home`);
    } catch (error) {
      console.log(error);
      return res.redirect(`http://${process.env.HOST_IP}:3000/welcome/login/wrong`);
    }
  }

  @Post('firstLogin')
  async firstLogin(
    @Request() req,
    @Body('login') login: string,
    @Body('avatarChosen') avatar: AvatarDto,
  ) {
    try {
      if (login.length < 4) throw new Error('Login too short');

      const avatarCreated = await this.authService.createAvatar(avatar);

      const user = await this.authService.updateAvatarLogin(
        req.user.id,
        login,
        avatarCreated,
      );

      const { access_token, refresh_token } = await this.authService.login(
        user,
        0,
        false,
      );

      return {
        error: false,
        access_token,
        refresh_token,
      };
    } catch (err) {
      return {
        error: true,
        message: err.message,
      };
    }
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  loginEmail(@Request() req) {
    return this.authService.login(
      req.user,
      0,
      req.user.isTwoFactorAuthenticationEnabled,
    );
  }

  @Public()
  @UseGuards(JwtNoExpirationGuard)
  @Post('refresh')
  async refresh(@Request() req, @Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(req.user.id, refreshToken);
  }

  @Public()
  @UseGuards(JwtNoExpirationGuard)
  @Post('refreshToken')
  async refreshToken(@Request() req) {
    const refreshToken = req.cookies['refresh-token'];
    return this.authService.refreshToken(req.user.id, refreshToken);
  }

  @Post('sendPassword')
  async sendPassword(@Req() req) {
    return await this.authService.sendPassword(req.user.id);
  }

  @Public()
  @Post('forgotPassword')
  async forgotPassword(
    @Body('email') email: string,
  ) {
    return await this.authService.forgotPassword(email);
  }
}
