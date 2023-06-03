import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import dataAPI42 from 'src/interfaces/dataAPI42.interface';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/typeorm/User.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private mailService: MailService,
	) {}

	async getToken42(code : string): Promise<dataAPI42> {
		const	response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				"grant_type": "authorization_code",
				"client_id": process.env.CLIENT_ID_42,
				"client_secret": process.env.SECRET_42,
				"code": code,
				"redirect_uri": "http://localhost:3000/api/auth/42"
			})
		})
		
		if (!response.ok)
			throw new UnauthorizedException();

		return await response.json();
	}

	async logUser(dataToken: dataAPI42): Promise<User> {
		const	response = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: {"Authorization": "Bearer " + dataToken.access_token}
		})

		if (!response.ok)
			throw new UnauthorizedException();
		
		const	content = await response.json();

		const	user: createUserDto = {
			login: content?.login,
			first_name: content?.first_name,
			last_name: content?.last_name,
			phone: content?.phone,
			email: content?.email,
			image: content?.image?.link,
			verified: true,
		};

		// update or save user in database
		const	user_old = await this.usersService.getUserByLogin(user?.login);
		
		if (!user_old)
			return await this.usersService.addUser(user);
		
		
		return await this.usersService.updateUser(user_old);
	}

	async validateUser(login: string, username: string, password: string): Promise<any> {
		const	user = await this.usersService.getUserByLogin(login);

		if (user)
			return user;
		return null;
	}

	async login(user: User) {
		const	payload = { login: user.login, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload)
		};
	}

	private generateSecureCode(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  		const bytes = randomBytes(length);
  		return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
	}

	async addUser(createUserDto: createUserDto) {
		createUserDto.expirationCode = Date.now() + 5 * 60 * 1000;
		createUserDto.verifyCode = this.generateSecureCode(8);
		createUserDto.verified = false;

		await this.mailService.sendUserConfirmation(createUserDto.email, createUserDto.login, createUserDto.verifyCode);

		return await this.usersService.addUser(createUserDto);
	}

	async verifyCode(code: string) {
		return await this.usersService.getUserByCode(code);
	}

	async sendNewCode(user: User) {
		user.expirationCode = Date.now() + 5 * 60 * 1000;
		user.verifyCode = this.generateSecureCode(8);
		
		await this.mailService.sendUserConfirmation(user.email, user.login, user.verifyCode);
		return await this.usersService.updateUser(user);
	}
}
