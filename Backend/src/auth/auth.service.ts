import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import dataAPI42 from 'src/utils/interfaces/dataAPI42.interface';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/utils/typeorm/User.entity';
import { createUserDto } from 'src/users/dto/CreateUser.dto';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from 'src/utils/crypto/crypto';
import { AvatarDto } from 'src/users/dto/Avatar.dto';
import { AvatarService } from 'src/avatar/avatar.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private	avatarService: AvatarService,
		private jwtService: JwtService,
		private mailService: MailService,
		private cryptoService: CryptoService,
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
			email: await this.cryptoService.encrypt(content?.email),
			first_name: await this.cryptoService.encrypt(content?.first_name),
			last_name: await this.cryptoService.encrypt(content?.last_name),
			phone: await this.cryptoService.encrypt(content?.phone),
			image: await this.cryptoService.encrypt(content?.image?.versions.large),
			verified: true,
			provider: "42",
		};

		const	user_old = await this.usersService.getUserByEmail(user.email);
		if (!user_old)
			return await this.usersService.addUser(user);
		
		return await this.usersService.updateUser(user_old);
	}

	async login(user: User) {
		const	payload = { sub: user.id, login: user.login };
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

		const	email = await this.cryptoService.decrypt(createUserDto.email);
		
		await this.mailService.sendUserConfirmation(email, createUserDto.verifyCode);

		return await this.usersService.addUser(createUserDto);
	}

	async verifyCode(code: string) {
		return await this.usersService.getUserByCode(code);
	}

	async sendNewCode(user: User) {
		user.expirationCode = Date.now() + 5 * 60 * 1000;
		user.verifyCode = this.generateSecureCode(8);
		
		const	email = await this.cryptoService.decrypt(user.email);

		await this.mailService.sendUserConfirmation(email, user.verifyCode);
		return await this.usersService.updateUser(user);
	}

	async loginWithGoogle(createUserDto: createUserDto) {
		if (!createUserDto)
			throw new UnauthorizedException('Unauthenticated');
		
		const encryptedValues = await Promise.all([
			this.cryptoService.encrypt(createUserDto.email),
			this.cryptoService.encrypt(createUserDto.first_name),
			this.cryptoService.encrypt(createUserDto.last_name),
			this.cryptoService.encrypt(createUserDto.image),
		]);
			
		createUserDto.email = encryptedValues[0];
		createUserDto.first_name = encryptedValues[1];
		createUserDto.last_name = encryptedValues[2];
		createUserDto.image = encryptedValues[3];
		
		let	user = await this.usersService.getUserByEmail(createUserDto.email);

		if (!user)
			user = await this.usersService.addUser(createUserDto);
		
		return this.login(user);
	}

	async updateUserLogin(userId: number, login: string) {
		const user = await this.usersService.getUserById(userId);
		
		if (!user)
			throw new Error('No user found');

		user.login = login;

		return await this.usersService.updateUser(user);
	}

	async updateAvatar(avatar: AvatarDto) {
		const	avatarUser = await this.avatarService.updateAvatar(avatar);

		if (!avatarUser)
			throw new Error("Cannot create or update avatar");

		return avatarUser;
	}
}
